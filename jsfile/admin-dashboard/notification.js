import { renderNotificationList } from "./notifications/notifications-list.js";
import { renderNotificationContent } from "./notifications/notifications-content.js";
import { notifications } from "../objects/notifications/data.js";
import { notificationType } from "../objects/notifications/Objects.js";

const filterButtons = document.querySelectorAll(".notifications-filter button");
let lists;
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("filter-btn-active"));
    btn.classList.add("filter-btn-active");
    const filter = btn.id;
    switch (filter) {
      case "btn-all":
        lists = notifications;
        break;
      case "btn-unread":
        lists = notifications.filter((n) => n.isRead === false);
        break;
      case "btn-account-changes":
        lists = notifications.filter(
          (n) => n.type === notificationType.ACCOUNT_CHANGES
        );
        break;
      case "btn-messages":
        lists = notifications.filter(
          (n) => n.type === notificationType.MESSAGES
        );
        break;
      case "btn-account-request":
        lists = notifications.filter(
          (n) => n.type === notificationType.ACCOUNT_REQUEST
        );
        break;
      case "btn-documents":
        lists = notifications.filter(
          (n) => n.type === notificationType.DOCUMENTS
        );
        break;
      case "btn-system":
        lists = notifications.filter((n) => n.type === notificationType.SYSTEM);
        break;
      default:
        lists = [];
    }
    renderNotificationList(lists, renderNotificationContent);
  });
});
document.querySelector(".notifications-filter #btn-all").click();
renderNotificationContent();