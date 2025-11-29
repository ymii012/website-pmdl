const openVisaBtn = document.getElementById("openVisa");
const visaModal = document.getElementById("visaModal");

openVisaBtn.addEventListener("click", () => {
  visaModal.classList.add("active");
});

visaModal.addEventListener("click", (e) => {
  if (e.target === visaModal) {
    visaModal.classList.remove("active");
  }
});
