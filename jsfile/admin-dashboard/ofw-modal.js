document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("viewModal");
  const editModal = document.getElementById("editProfileModal");
  const closeBtn = modal.querySelector(".modal-close");
  const closeFooterBtn = modal.querySelector(".btn-close-footer");

  const editCloseBtn = editModal.querySelector(".modal-close");
  const editCloseFooterBtn = editModal.querySelector(".btn-close-footer");
  const editProfileBtn = document.getElementById("editProfileBtn");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const editProfileForm = document.getElementById("editProfileForm");

  // Inside view modal
  const modalName = document.getElementById("modalName");
  const modalDestination = document.getElementById("modalDestination");
  const modalPosition = document.getElementById("modalPosition");
  const modalStatus = document.getElementById("modalStatus");

  // Tabs
  const tabButtons = modal.querySelectorAll(".tab-button");
  const tabPanes = modal.querySelectorAll(".tab-pane");

  let currentOfwId = null;

  // === TAB SWITCHING ===
  function setupTabSwitching() {
    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabButtons.forEach((b) => b.classList.remove("active"));
        tabPanes.forEach((p) => p.classList.remove("active"));

        btn.classList.add("active");
        const target = btn.getAttribute("data-tab");
        document.getElementById(target).classList.add("active");
      });
    });
  }

  function resetTabsToDefault() {
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabPanes.forEach((p) => p.classList.remove("active"));

    const documentsTab = modal.querySelector('.tab-button[data-tab="documents"]');
    const documentsPane = document.getElementById("documents");

    if (documentsTab && documentsPane) {
      documentsTab.classList.add("active");
      documentsPane.classList.add("active");
    }
  }

  setupTabSwitching();

  // === VIEW PROFILE CLICK ===
  document.querySelectorAll(".viewBtn").forEach((button) => {
    button.addEventListener("click", async () => {

      currentOfwId = button.getAttribute("data-id");

      openModal();

      modalName.textContent = "Loading...";
      modalDestination.textContent = "—";
      modalPosition.textContent = "—";
      modalStatus.textContent = "—";

      resetTabsToDefault();

      try {
        const response = await fetch("php/admin/ofw_view_details.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ id: currentOfwId }),
        });

        const data = await response.json();

        if (data.error) {
          modalName.textContent = "Error loading data";
          console.error(data.error);
          return;
        }

        modalName.textContent = data.Name || "No Name";
        modalDestination.textContent = data.Destination || "—";
        modalPosition.textContent = data.Position || "—";
        modalStatus.textContent = data.Status || "—";

        document.getElementById("documentsContent").innerHTML =
          `<p>Documents for ${data.Name}</p>`;
        document.getElementById("personalContent").innerHTML =
          `<p>Personal details for ${data.Name}</p>`;
        document.getElementById("employmentContent").innerHTML =
          `<p>Employment info for ${data.Name}</p>`;

      } catch (err) {
        console.error("Error fetching OFW details:", err);
        modalName.textContent = "Failed to load details";
      }
    });
  });

  // === EDIT PROFILE BUTTON ===
  editProfileBtn.addEventListener("click", async () => {
    if (!currentOfwId) {
      alert("No OFW ID found.");
      return;
    }

    try {
      editProfileBtn.textContent = "Loading...";
      editProfileBtn.disabled = true;

      const response = await fetch("php/admin/ofw_get_full_details.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ id: currentOfwId }),
      });

      const text = await response.text();
      let data = JSON.parse(text);

      if (data.error) {
        alert("Error: " + data.error);
        return;
      }

      populateEditForm(data);

      closeModal();
      openEditModal();
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to load profile.");
    } finally {
      editProfileBtn.textContent = "Edit Profile";
      editProfileBtn.disabled = false;
    }
  });

  // === POPULATE EDIT FORM (Status must be numeric) ===
  function populateEditForm(data) {

    document.getElementById("editOfwId").value = currentOfwId;

    document.getElementById("editLastName").value = data.Last_Name || "";
    document.getElementById("editFirstName").value = data.First_Name || "";
    document.getElementById("editMiddleName").value = data.Middle_Name || "";
    document.getElementById("editExtensionName").value = data.Extension_Name || "";
    document.getElementById("editSex").value = data.Sex || "";
    document.getElementById("editCivilStatus").value = data.Civil_Status || "";
    document.getElementById("editDateOfBirth").value = data.Date_of_Birth || "";
    document.getElementById("editNationality").value = data.Nationality || "";

    document.getElementById("editDestination").value = data.Destination || "";
    document.getElementById("editJob").value = data.Job || data.Position || "";

    // Convert text → numeric dropdown value
    let statusNumber = "";
    switch (data.Status) {
      case "Pending": statusNumber = "1"; break;
      case "Complete": statusNumber = "2"; break;
      case "Incomplete": statusNumber = "3"; break;
    }

    document.getElementById("editStatus").value = statusNumber;
  }

  // === SAVE EDITED STATUS ===
  saveProfileBtn.addEventListener("click", async () => {
    const status = document.getElementById("editStatus").value;

    if (!status) {
      alert("Please select a status.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("ofw_id", document.getElementById("editOfwId").value);
      formData.append("status", status);

      const response = await fetch("php/admin/ofw_update_profile.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert("Profile updated successfully!");
        closeEditModal();
        await refreshViewModal();
      } else {
        alert("Update error: " + result.error);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to update profile");
    }
  });

  // === REFRESH VIEW MODAL ===
  async function refreshViewModal() {
    if (!currentOfwId) return;

    try {
      const response = await fetch("php/admin/ofw_view_details.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ id: currentOfwId }),
      });

      const data = await response.json();

      modalName.textContent = data.Name || "No Name";
      modalDestination.textContent = data.Destination || "—";
      modalPosition.textContent = data.Position || "—";
      modalStatus.textContent = data.Status || "—";

      openModal();
    } catch (err) {
      console.error("Error refreshing modal:", err);
    }
  }

  // === MODAL CONTROLS ===
  function openModal() {
    modal.classList.add("active");
  }
  function closeModal() {
    modal.classList.remove("active");
  }
  function openEditModal() {
    editModal.classList.add("active");
  }
  function closeEditModal() {
    editModal.classList.remove("active");
  }

  closeBtn.addEventListener("click", closeModal);
  closeFooterBtn.addEventListener("click", closeModal);

  editCloseBtn.addEventListener("click", closeEditModal);
  editCloseFooterBtn.addEventListener("click", closeEditModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  editModal.addEventListener("click", (e) => {
    if (e.target === editModal) closeEditModal();
  });

});
