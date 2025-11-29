export function accountSettingsInit() {
  document
    .getElementById("account-save-changes")
    .addEventListener("click", () => {
      const fullName = document.querySelector(".account-form #fullname").value;
      const email = document.querySelector(".account-form #email").value;
      const role = document.querySelector(".account-form #role").value;
      const department = document.querySelector(
        ".account-form #department"
      ).value;

      console.log(`
        Full Name: ${fullName || "Not provided"} \n
        Email: ${email || "Not provided"} \n
        Role: ${role || "Not provided"} \n
        Department: ${department || "Not provided"}
        `);
    });
}
