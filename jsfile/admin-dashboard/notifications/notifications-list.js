import { notificationType } from "../../objects/notifications/Objects.js";
import { formatDateTime } from "../../utils/format.js";
export function renderNotificationList(notifList, renderNotificationContent) {
  const list = document.querySelector(".notifications-list-js");
  list.classList.remove("notif-list-empty");
  list.innerHTML = renderList();
  function renderList() {
    let html = "";
    if (notifList.length === 0) {
      list.classList.add("notif-list-empty");
      html = `
        <div>
          <img src="images/icons/notifications-list-empty.png" alt="">
          <h6>You have no notifications</h6>
        </div>
      `;
    }
    notifList.forEach((notif) => {
      html += `
      <div class="notification-list-container notification-list-container-js ${
        notif.isRead ? "" : "notif-unread"
      }" data-notification-id="${notif.id}">
        <img src="${selectIconType(
          notif.type
        )}" alt="" class="notification-icon">
        <div class="notification-details">
          <p class="notification-name">${notif.title}</p>
          <p class="notification-time-stamp">
          ${formatDateTime(notif.timestamp)}
          </p>
          <p class="notification-message">${notif.message}</p>
        </div>
        <img class = "notif-tag"src="./images/icons/dot-icon-red.png" alt="">
      </div>
    `;
    });
    return html;
  }
  const lists = document.querySelectorAll(".notification-list-container-js");

  lists.forEach((item) => {
    item.addEventListener("click", () => {
      lists.forEach((list) => list.classList.remove("notif-active"));
      const notifId = Number(item.dataset.notificationId);
      const notif = notifList.find((notif) => notif.id == notifId);
      console.log(notifId);
      renderNotificationContent(notifId);
      if (notif.isRead === false) {
        notif.isRead = true;
        item.classList.remove("notif-unread");
      }
      item.classList.add("notif-active");
    });
  });
  function selectIconType(type) {
    switch (type) {
      case `${notificationType.ACCOUNT_CHANGES}`:
        return "images/icons/profile-update-icon.png";
      case `${notificationType.MESSAGES}`:
        return "images/icons/message-icon.png";
      case `${notificationType.ACCOUNT_REQUEST}`:
        return "images/icons/account-request-icon.png";
      case `${notificationType.DOCUMENTS}`:
        return "images/icons/docs-icon.png";
      case `${notificationType.SYSTEM}`:
        return "images/icons/System-maintenance-icon.png";
      case `${notificationType.JOB_ORDER}`:
        return "images/icons/job-order-icon.png";
    }
  }
}
