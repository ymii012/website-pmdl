
  const openBtn = document.getElementById("openPassport");
  const modal = document.getElementById("passportModal");

  openBtn.addEventListener("click", () => {
    modal.classList.add("active");
  });

  // Close when clicking outside the image
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

