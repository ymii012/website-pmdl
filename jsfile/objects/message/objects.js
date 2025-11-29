export class chat {
  #id;
  #chatName;
  #createdBy;
  #createdAt;

  constructor(id, chatName, createdBy, createdAt = Date.now()) {
    this.#id = id;
    this.#chatName = chatName;
    this.#createdBy = createdBy;
    this.#createdAt = createdAt;
  }

  // Getters
  get id() {
    return this.#id;
  }

  get chatName() {
    return this.#chatName;
  }

  get createdBy() {
    return this.#createdBy;
  }

  get createdAt() {
    return this.#createdAt;
  }

  // Setters
  set id(value) {
    this.#id = value;
  }

  set chatName(value) {
    this.#chatName = value;
  }

  set createdBy(value) {
    this.#createdBy = value;
  }

  set createdAt(value) {
    this.#createdAt = typeof value === "number" ? value : Date.now();
  }
}

export class chatMembers {
  #chatId;
  #userId;

  constructor(id, chatId, userId) {
    this.#chatId = chatId;
    this.#userId = userId;
  }

  // Getters
  get chatId() {
    return this.#chatId;
  }

  get userId() {
    return this.#userId;
  }

  // Setters

  set chatId(value) {
    this.#chatId = value;
  }

  set userId(value) {
    this.#userId = value;
  }
}
export class message {
  #id;
  #chatId;
  #senderId;
  #message;
  #timestamp;
  #isRead;

  constructor(
    id,
    chatId,
    senderId,
    message,
    timestamp = Date.now(),
    isRead = false
  ) {
    this.#id = id;
    this.#chatId = chatId;
    this.#senderId = senderId;
    this.#message = message;
    this.#timestamp =
      timestamp instanceof Date ? timestamp : new Date(timestamp);
    this.#isRead = Boolean(isRead);
  }

  // Getters
  get id() {
    return this.#id;
  }

  get chatId() {
    return this.#chatId;
  }

  get senderId() {
    return this.#senderId;
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

  // Setters
  set id(value) {
    this.#id = value;
  }

  set chatId(value) {
    this.#chatId = value;
  }

  set senderId(value) {
    this.#senderId = value;
  }

  set message(value) {
    this.#message = value;
  }

  set timestamp(value) {
    this.#timestamp = typeof value === "number" ? value : Date.now();
  }

  set isRead(value) {
    this.#isRead = Boolean(value);
  }
}
