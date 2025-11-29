import { notifications } from "../../objects/notifications/data.js";
import { notificationType } from "../../objects/notifications/Objects.js";
import { formatDateTime } from "../../utils/format.js";
import { users } from "../../objects/users.js";
export function renderNotificationContent(notifId = false) {
  const content = document.querySelector(".notifications-content-js");
  content.classList.remove("notif-content-empty");
  if (notifId === false) {
    content.classList.add("notif-content-empty");
    content.innerHTML = `
        <div>
          <img src="images/icons/notification-bell-icon-grey.png" alt="">
          <h5>Select a notification</h5>
          <p>Choose a notification from the list to view its details</p>
        </div>
    `;
    return;
  }
  const notif = notifications.find((notif) => notif.id === notifId);
  let user;

  if (notif.type === notificationType.SYSTEM) {
    user = { firstName: "System", lastName: "Update" };
  } else {
    user = users.find((u) => {
      switch (notif.type) {
        case notificationType.ACCOUNT_CHANGES:
          return u.id === notif.updatedBy;
        case notificationType.MESSAGES:
          return u.id === notif.fromUser;
        case notificationType.ACCOUNT_REQUEST:
        case notificationType.DOCUMENTS:
          return u.id === notif.userId;
        case notificationType.JOB_ORDER:
          return u.id === notif.updatedBy;
      }
    });
  }

  console.log(user);
  content.innerHTML = renderContent();

  function renderContent() {
    return `
    ${renderHeader()}
    <div class="notification-content-body">
      <div class="notification-user-info">
        <img src="images/icons/sample-profile.jpg" alt="">
        <div class="details">
          <p class="user-name">${user.firstName + " " + user.lastName}</p>
          <p class="user-action">User Action</p>
        </div>
      </div>
      ${renderContentType()}
    </div>
  `;
  }
  function renderHeader() {
    return `
    <div class="notification-content-header">
      <div class="notification-content-name">
        <h4>${notif.title}</h4>
        <p class = "notification-content-timestamp">
          ${formatDateTime(notif.timestamp)}
        </p>
      </div>
      <div class="notification-content-actions">
        <button><img src="images/icons/check-icon.png" alt=""></button>
        <button><img src="images/icons/bin-icon.png" alt=""></button>
      </div>
    </div>
    `;
  }
  function renderContentType() {
    console.log("abc");
    switch (notif.type) {
      case `${notificationType.ACCOUNT_CHANGES}`:
        return `
          <div class="notification-context">
            <p>${user.firstName} updated ${
          user.sex === "female" ? "her" : "his"
        } profile</p>
            <div class="notification-context-details-profile">
              <h5>Account Changes</h5>
              ${notif.renderUpdatedFields(user)}
            </div>
          </div>
        `;
      case `${notificationType.MESSAGES}`:
        return `
          <div class="notification-context">
            <p>New Message from ${user.firstName + " " + user.lastName}</p>
            <div class="notification-context-details-message">
              <h5>Message Preview</h5>
              <div class="message-preview">
                "${notif.previewMessage}"
              </div>
              <button><img src="images/icons/message-icon-white.png" alt="">Open Conversation</button>
            </div>
          </div>
          `;
      case `${notificationType.ACCOUNT_REQUEST}`:
        return `
          <div class="notification-context">
            <p>${notif.message}</p>
            <div class="notification-context-details-account-request">
              <h4>Account Request Details</h4>
              <div>
                <h6>Request ID:</h6>
                <p>${notif.requestId}</p>
              </div>
              <div>
                <h6>User ID:</h6>
                <p>${notif.userId}</p>
              </div>
              <div>
                <h6>Status:</h6>
                <p>${notif.status}</p>
              </div>
              
              <div class = "buttons">
                <button id="notif-account-req-approve"class = "approved-btn" data-notification-id="${notif.id}">&#10003; Approve</button>
                <button  id="notif-account-req-reject" class = "reject-btn" data-notification-id="${notif.id}">&#10005; Reject</button>
              </div>
            </div>
          </div>
          `;
      case `${notificationType.DOCUMENTS}`:
        return `
          <div class="notification-context">
            <p>${notif.message}</p>
            <div class="notification-context-details-documents">
              <h4>Document Update</h4>
              <div>
                <h6>User ID:</h6>
                <p>${notif.userId}</p>
              </div>
              <div class="status ${
                notif.action === "approved" ? "approved" : "pending"
              }">
                <h6>Action:</h6>
                <p>${notif.action}</p>
              </div>
              <button id="view-document-btn" data-notificatin-id="${
                notif.id
              }"><img src="images/icons/doc-icon-white.png" alt="">View Document</button>
            </div>
          </div>
          `;
      case `${notificationType.SYSTEM}`:
        return `
          <div class="notification-context">
            <p>${notif.message}</p>
            <div class="notification-context-details-system-maintenance">
              <h4>System Notification</h4>
              <h6>Affected Services:</h6>
              <ul>
                <li>User registration</li>
                <li>Document uploads</li>
                <li>Payment processing</li>
              </ul>
              <p class="contact">Contact: IT support at suppor@pmdl.gov.ph</p>
            </div>
          </div>
          `;
      case `${notificationType.JOB_ORDER}`:
        return `
          <div class="notification-context">
            <p>Message Preview</p>
            <div class="notification-context-details-job-order">
              <h4>Job Order Details</h4>
              <div>
                <h6>Job Order ID:</h6>
                <p>JO-2023-001</p>
              </div>
              <div>
                <h6>Position:</h6>
                <p>Registered Nurse</p>
              </div>
              <div>
                <h6>Employer:</h6>
                <p>Al Faisal Hospital</p>
              </div>
              <div>
                <h6>Location:</h6>
                <p>Saudi Arabia</p>
              </div>
              <div>
                <h6>Vacancies:</h6>
                <p>25</p>
              </div>
              <button>
                <img src="images/icons/job-order-white-icon.png" alt="">View Job Order
              </button>
            </div>
          </div>
          `;
    }
  }
}
