export function securitySettingsInit() {
  function toggleVisibilityPassword() {
    const buttons = document.querySelectorAll(".security-toggle-password");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const input = button.previousElementSibling;

        const isHidden = input.type === "password";

        input.type = isHidden ? "text" : "password";

        button.src = isHidden
          ? "images/icons/visible-on-icon.png"
          : "images/icons/visible-off-icon.png";
      });
    });
  }

  document
    .getElementById("security-save-changes")
    .addEventListener("click", saveChnages);
  toggleVisibilityPassword();
  isEnableTwoFA();
  function saveChnages() {
    const currentPass = document.getElementById("currentPassword");
    const newPass = document.getElementById("newPassword");
    const confirmPass = document.getElementById("confirmPassword");

    console.log(currentPass.value);
    console.log(newPass.value);
    console.log(confirmPass.value);
  }
  function isEnableTwoFA() {
    const toggleTwoFA = document.getElementById("toggleTwoFA");
    toggleTwoFA.addEventListener("change", () => {
      console.log(toggleTwoFA.checked);
    });
  }
}
