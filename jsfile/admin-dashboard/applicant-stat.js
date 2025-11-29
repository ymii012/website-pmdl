// Get elements
const openModalBtn = document.getElementById("updStat");
const modal = document.querySelector(".modal-app-status");
const cancelBtn = document.getElementById("cancel-stat-upd");

// Open modal
openModalBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

// Close modal
cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Optional: Close modal when clicking outside the modal body
window.addEventListener("click", (e) => {
    const modalBody = document.querySelector(".app-status-body");
    if (e.target === modal && !modalBody.contains(e.target)) {
        modal.style.display = "none";
    }
});
