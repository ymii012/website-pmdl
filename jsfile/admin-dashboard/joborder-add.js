document.addEventListener("DOMContentLoaded", () => {

    // ---------------- MODAL OPEN/CLOSE ---------------- //
    const modal = document.getElementById("jobOrderModal");
    const openBtn = document.getElementById("btnAddJob");
    const closeBtn = document.getElementById("closeModal");
    const closeBtn2 = document.getElementById("closeModal2");

    openBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    function closeModal() {
        modal.style.display = "none";
    }

    closeBtn.addEventListener("click", closeModal);
    closeBtn2.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });



    // ---------------- FUNCTION TO CREATE FIELD WITH DELETE BUTTON ---------------- //
    function createField(wrapper, name) {
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.gap = "6px";
        container.style.marginBottom = "6px";

        const input = document.createElement("input");
        input.type = "text";
        input.name = name;
        input.className = "topbox-input flex-1";
        input.placeholder = "Enter value";

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.textContent = "×";
        delBtn.style.background = "#cc0000";
        delBtn.style.color = "white";
        delBtn.style.border = "none";
        delBtn.style.fontWeight = "bold";
        delBtn.style.padding = "4px 10px";
        delBtn.style.borderRadius = "4px";
        delBtn.style.cursor = "pointer";

        delBtn.addEventListener("click", () => {
            container.remove();
        });

        container.appendChild(input);
        container.appendChild(delBtn);

        wrapper.appendChild(container);
    }



    // ---------------- ADD REQUIREMENT FIELD ---------------- //
    const requirementsWrapper = document.getElementById("requirementsWrapper");
    const addReqBtn = document.getElementById("addRequirement");

    addReqBtn.addEventListener("click", () => {
        createField(requirementsWrapper, "requirements[]");
    });



    // ---------------- ADD BENEFIT FIELD ---------------- //
    const benefitsWrapper = document.getElementById("benefitsWrapper");
    const addBenBtn = document.getElementById("addBenefit");

    addBenBtn.addEventListener("click", () => {
        createField(benefitsWrapper, "benefits[]");
    });

});



// ---------------- FORM SUBMISSION ---------------- //
document.getElementById("jobForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch("php/admin/joborder_add.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        if (data.trim() === "success") {
            alert("Job Order Created!");
            location.reload();
        } else {
            alert(data);
        }
    });
});
