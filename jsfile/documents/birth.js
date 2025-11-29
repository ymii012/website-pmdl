const openBirthBtn = document.getElementById("openBirth");
const birthModal = document.getElementById("birthModal");

openBirthBtn.addEventListener("click", () => {
  birthModal.classList.add("active");
});

birthModal.addEventListener("click", (e) => {
  if (e.target === birthModal) {
    birthModal.classList.remove("active");
  }
});
