import { chatManager } from "../../objects/message/data copy.js";
import { loggedInUser } from "../../objects/loggedInUser.js";
// =========================
// Notification Types
// =========================
export const notificationType = {
  ACCOUNT_CHANGES: "ACCOUNT_CHANGES",
  MESSAGES: "MESSAGES",
  ACCOUNT_REQUEST: "ACCOUNT_REQUEST",
  DOCUMENTS: "DOCUMENTS",
  SYSTEM: "SYSTEM",
  JOB_ORDER: "JOB_ORDER",
};

// =========================
// Base Notification Class
// =========================
export class Notification {
  #id;
  #type;
  #title;
  #message;
  #timestamp;
  #isRead;

  constructor({
    id,
    type,
    title,
    message,
    timestamp = new Date(),
    isRead = false,
  }) {
    this.#id = id;
    this.#type = type;
    this.#title = title;
    this.#message = message;
    this.#timestamp = timestamp;
    this.#isRead = isRead;
  }

  // Getters
  get id() {
    return this.#id;
  }
  get type() {
    return this.#type;
  }
  get title() {
    return this.#title;
  }
  get message() {
    return this.#message;
  }
  get timestamp() {
    return this.#timestamp;
  }
  get isRead() {
    return this.#isRead;
  }
  set isRead(bool) {
    this.#isRead = bool;
  }

  // Methods
  markAsRead() {
    this.#isRead = true;
  }
}

// =========================
// Account Changes Notification
// =========================
export class AccountChangesNotification extends Notification {
  #updatedFields; // array of fields changed
  #updatedBy; // user ID or username

  constructor({
    id,
    type = notificationType.ACCOUNT_CHANGES,
    title,
    message,
    timestamp = new Date(),
    isRead = false,
    updatedFields,
    updatedBy,
  }) {
    super({
      id,
      type,
      title,
      message,
      timestamp,
      isRead,
    });
    this.#updatedFields = updatedFields;
    this.#updatedBy = updatedBy;
  }

  get updatedFields() {
    return this.#updatedFields;
  }
  get updatedBy() {
    return this.#updatedBy;
  }
  renderUpdatedFields(user) {
    let html = "";
    this.#updatedFields.forEach((field) => {
      html += `
        <h6>${field.name}:</h6>
        <p>${field.value}</p>
      `;
    });
    html += `<p class="updated-by">Changed by: ${user.firstName} ${user.lastName}</p>`;
    return html;
  }
}

// =========================
// Message Notification
// =========================
export class MessageNotification extends Notification {
  #fromUser;
  #conversationId;
  #previewMessage;

  constructor({
    id,
    type = notificationType.MESSAGES,
    title,
    message,
    timestamp = new Date(),
    isRead = false,
    conversationId,
  }) {
    super({
      id,
      type,
      title,
      message,
      timestamp,
      isRead,
    });
    this.#conversationId = conversationId;
    this.#fromUser = chatManager
      .getChatMembers(conversationId)
      .find((member) => member.userId !== loggedInUser.id).userId;
    const messages = chatManager
      .getChatMessages(conversationId)
      .filter((message) => message.senderId === this.#fromUser);
    this.#previewMessage = chatManager.getLatestMessage(messages).message;
  }

  get fromUser() {
    return this.#fromUser;
  }
  get conversationId() {
    return this.#conversationId;
  }
  get previewMessage() {
    return this.#previewMessage;
  }
}

// =========================
// Account Request Notification
// =========================
export class AccountRequestNotification extends Notification {
  #requestId;
  #userId;
  #status; // pending, approved, rejected

  constructor({
    id,
    type = notificationType.ACCOUNT_REQUEST,
    title,
    message,
    timestamp = new Date(),
    isRead = false,
    requestId,
    userId,
    status,
  }) {
    super({
      id,
      type,
      title,
      message,
      timestamp,
      isRead,
    });
    this.#requestId = requestId;
    this.#status = status;
    this.#userId = userId;
  }

  get requestId() {
    return this.#requestId;
  }
  get status() {
    return this.#status;
  }
  get userId() {
    return this.#userId;
  }
}

// =========================
// Document Notification
// =========================
export class DocumentNotification extends Notification {
  #userId;
  #documentId;
  #action; // uploaded, approved, rejected, updated

  constructor({
    id,
    type = notificationType.DOCUMENTS,
    title,
    message,
    timestamp = new Date(),
    isRead = false,
    documentId,
    userId,
    action,
  }) {
    super({
      id,
      type,
      title,
      message,
      timestamp,
      isRead,
    });
    this.#documentId = documentId;
    this.#action = action;
    this.#userId = userId;
  }
  get userId() {
    return this.#userId;
  }
  get documentId() {
    return this.#documentId;
  }
  get action() {
    return this.#action;
  }
}

// =========================
// System Notification
// =========================
export class SystemNotification extends Notification {
  #severity; // low, normal, high, critical
  #affectedServices;

  constructor({
    id,
    type = notificationType.SYSTEM,
    title,
    message,
    timestamp = new Date(),
    isRead = false,
    severity,
    updatedFields: affectedServices,
  }) {
    super({
      id,
      type,
      title,
      message,
      timestamp,
      isRead,
    });
    this.#severity = severity;
    this.#affectedServices = affectedServices;
  }

  get severity() {
    return this.#severity;
  }
  get affectedServices() {
    return this.#affectedServices;
  }
  renderServices() {
    let html = "";
    this.#affectedServices.forEach(
      (service) => (html += `<li>${service}</li>`)
    );
  }
}

// =========================
// Job Order Notification
// =========================
export class JobOrderNotification extends Notification {
  #jobId;
  #updatedBy;
  #status; // assigned, completed, cancelled, updated

  constructor({
    id,
    type = notificationType.JOB_ORDER,
    title,
    message,
    timestamp = new Date(),
    isRead = false,
    jobId,
    updatedBy,
    status,
  }) {
    super({
      id,
      type,
      title,
      message,
      timestamp,
      isRead,
    });
    this.#jobId = jobId;
    this.#status = status;
    this.#updatedBy = updatedBy;
  }

  get jobId() {
    return this.#jobId;
  }
  get updatedBy() {
    return this.#updatedBy;
  }
  get status() {
    return this.#status;
  }
}
