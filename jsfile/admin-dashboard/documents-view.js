// Get elements
const openDocModalBtn = document.getElementById("viewDocuPart");
const docModal = document.getElementById("docuModalview");
const closeDocModalBtn = document.getElementById("closeModaldocu");

// Open modal
openDocModalBtn.addEventListener("click", () => {
    docModal.style.display = "flex";
});

// Close modal
closeDocModalBtn.addEventListener("click", () => {
    docModal.style.display = "none";
});

// Optional: Close when clicking outside modal body
window.addEventListener("click", (e) => {
    const modalBody = document.querySelector(".documents-body");
    if (e.target === docModal && !modalBody.contains(e.target)) {
        docModal.style.display = "none";
    }
});
