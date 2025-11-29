import { chatManager } from "../../objects/message/data copy.js";

export function renderMessagesConversation(
  loggedInUser,
  chatId = null,
  renderMessagesList
) {
  console.log("conversation - Logged User: ", loggedInUser.firstName);
  const chat = chatId ? chatManager.getChat(chatId) : null;

  const chatContainer = document.querySelector(".messages-conversation-js");

  if (!chat) {
    chatContainer.innerHTML = `
    <div class="conversation-container-error">
      <div class="conversation-image-container-error">
        <img class = "conversation-image-error" src="images/icons/message-icon.svg" alt="" />
      </div>
      <div class="conversation-message-error">
        <h3>Your Messages</h3>
        <p>Select a conversation to start messaging</p>
      </div>
    </div>
    `;
    return;
  }
  const user = chatManager.getConversationWith(chat, loggedInUser);
  const messages = chatManager.getChatMessages(chat.id);

  initScrollListener();

  function initScrollListener() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initScroll);
    } else {
      initScroll();
    }
  }
  function initScroll() {
    scrollConversationToBottom();
    window.addEventListener("load", scrollConversationToBottom);
  }

  function scrollConversationToBottom() {
    const chat = document.querySelector(".conversation-messages");
    if (!chat) return;
    chat.scrollTop = chat.scrollHeight;
  }

  chatContainer.innerHTML = `
    <div class="conversation-container">
      ${renderConversationHeader()}

      <div class="conversation-chat">
        <div class="conversation-messages">
          ${renderConversationMessages()}
        </div>
      </div>

      ${renderConversationFooter()}
    </div>
    `;
  const conversationMessages = document.querySelector(".conversation-messages");
  if (messages.length === 0 && conversationMessages) {
    conversationMessages.classList.add("conversation-messages-new");
  }
  document
    .querySelector(".send-message-js")
    .addEventListener("click", sendMessage);
  document.querySelector(".message-type").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const messageInput = document.querySelector(".message-type");
    const messageText = messageInput.value.trim();
    if (messageText === "") return;
    console.log(messageText);

    chatManager.createMessage(chat.id, loggedInUser.id, messageText);
    chatManager.save();

    renderMessagesList(loggedInUser, renderMessagesConversation);
    renderMessagesConversation(loggedInUser, chat.id);
    messageInput.value = "";
    initScrollListener();
    setTimeout(() => {
      const newInput = document.querySelector(".message-type");
      if (newInput) newInput.focus();
    }, 0);
  }
  function renderConversationHeader() {
    const html = `
      <div class="conversation-name">
        <img src="images/icons/sample-profile.jpg" alt="" class="chat-profile">
        <div class="chat-details">
          <h3 class="chat-name">
          ${chatManager.setChatName(loggedInUser, chat)}</h3>
          <p class="chat-status">
          ${user.isOnline ? "🟢 Online" : "🔘 Offline"}
          </p>
        </div>
      </div>
    `;
    return html;
  }
  function renderConversationMessages() {
    let html = "";
    if (messages.length === 0) {
      html = `
      <div class="conversation-image-container-new">
        <img class = "conversation-image-new" src="images/icons/new-message-icon.svg" alt="" />
      </div>
      <div class="conversation-message-new">
        <h3>New Chat</h3>
        <p>Send a message to start conversation</p>
      </div>
      `;
      return html;
    }
    messages.forEach((message) => {
      const text = message.message;
      const timeStamp = chatManager.formatTime(message.timestamp);
      const isRead = message.isRead ? "&#10003&#10003" : "&#10003";
      if (message.senderId === loggedInUser.id) {
        html += `
        <div class="chat-sent">
          <div class = "conversatrion-message">
            <p>
             ${text}
            </p>
              <p class="time-stamp">${timeStamp}<span class="isRead">${isRead}</span></p>
          </div>
        </div>
      `;
      } else {
        html += `
       <div class="chat-reply">
          <div class = "conversatrion-message">
            <p>
              ${text}
            </p>
            <p class="time-stamp">${timeStamp}<span class="isRead">${isRead}</span></p>
          </div>
        </div>
      `;
      }
    });
    return html;
  }
  function renderConversationFooter() {
    const html = `
      <div class="conversation-type-message">
        <span class="attach">
          <img class="message-type-icon" src="images/icons/attach-file-icon.svg">
        </span>
        <input type="text" class="message-type" placeholder="Type here...">
        <span class="send send-message-js">
          <img class="message-type-icon" src="images/icons/send-icon.svg">
        </span>
      </div>
    `;
    return html;
  }
}
