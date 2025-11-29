export function notificationsSettingsInit() {
  const toggles = document.querySelectorAll(".notification-item-toggle input");

  saveChanges();

  function saveChanges() {
    const saveBtn = document.getElementById("notification-save-changes");
    saveBtn.addEventListener("click", () => {
      toggles.forEach((toggle) => {
        const isChecked = toggle.checked;
        console.log(
          `Saved notification setting for ${toggle.id}: ${isChecked}`
        );
      });
    });
  }
}
