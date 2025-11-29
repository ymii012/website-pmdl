const openNbiBtn = document.getElementById("openNbi");
const nbiModal = document.getElementById("nbiModal");

// Open modal
openNbiBtn.addEventListener("click", () => {
  nbiModal.classList.add("active");
});

// Close when clicking the dark background
nbiModal.addEventListener("click", (e) => {
  if (e.target === nbiModal) {
    nbiModal.classList.remove("active");
  }
});
