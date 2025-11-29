import { users } from "../../objects/users.js";
import { chatManager } from "../../objects/message/data copy.js";

export class MessagesList {
  constructor() {}
  render(loggedInUser, renderConversation) {
    const self = this;
    const messagesListContainer = document.querySelector(".messages-list-js");

    messagesListContainer.innerHTML = "";

    const userChats = chatManager.getChats(loggedInUser.id);

    if (userChats.length === 0) {
      messagesListContainer.innerHTML += `
      ${renderChatListHeader()}
        <div class="list empty-list">
          <div class = "chat-icon-error">
            <img src="images/icons/no-chat-list.svg" alt="">
          </div>
          No conversation(s) found.
        </div>
      `;
      return;
    }
    messagesListContainer.innerHTML += `
      ${renderChatListHeader()}
      <div class="lists">
        ${renderChatList()}
      </div>
    `;
    openConversation();

    let timeout;
    const searchResult = document.querySelector(".search-result");
    const searchInput = document.querySelector(".search input");
    searchInput.addEventListener("keyup", (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const searchTerm = e.target.value.toLowerCase().trim();

        if (!searchTerm) {
          searchResult.innerHTML = `<p>Type to search...</p>`;
          searchResult.classList.remove("search-result-popup");
          return;
        }

        const result = users
          .filter((user) =>
            `${user.firstName} ${user.lastName}`
              .toLowerCase()
              .includes(searchTerm)
          )
          .filter((user) => user.id !== loggedInUser.id);

        searchResult.innerHTML = renderSearchResults(result);
        searchResult.classList.add("search-result-popup");
        clickProfile();
      }, 300);
    });

    function renderSearchResults(searchUsers) {
      let html = "";
      if (searchUsers.length === 0) {
        return `<p>No results found.</p>`;
      }
      searchUsers.forEach((user) => {
        html += `
        <div class="profile profile-js" data-user-id="${user.id}">
          <img src="${user.profilePicture}" alt="User Profile" />
          <h4>${user.firstName + " " + user.lastName}</h4>
        </div>
        `;
      });
      return html;
    }

    function renderChatListHeader() {
      return `
        <div class="list-header">
          <h3>Messages</h3>
          <div class="search">
            <span><img src="images/icons/search-icon.svg" alt="Search"/></span>
            <input type="text" placeholder="Search..." />
            <div class="search-result"></div>
          </div>
        </div>
      `;
    }

    function renderChatList() {
      let html = "";
      userChats.forEach((chat) => {
        const messages = chatManager.getChatMessages(chat.id);
        let timestamp = chatManager.formatTime(chat.createdAt);
        let latestMessage = "New Chat.";

        if (messages && messages.length > 0) {
          const latestMsg = chatManager.getLatestMessage(messages);
          timestamp = chatManager.formatTime(latestMsg.timestamp);
          if (loggedInUser.id === latestMsg.senderId) {
            latestMessage = "You: " + latestMsg.message;
          } else {
            latestMessage = latestMsg.message;
          }
        }
        html += `
          <div class="conversation conversation-js" data-chat-id="${chat.id}">
            <img src="images/icons/sample-profile.jpg" alt="" />
            <div class="details">
              <div>
                <h4 class="name">${chatManager.setChatName(
                  loggedInUser,
                  chat
                )}</h4>
                <span class="time">
                ${timestamp}
                </span>
              </div>
              <p class="chat">
                ${latestMessage}
              </p>
            </div>
            <span class="notif">🔴</span>
          </div>
        `;
      });
      return html;
    }

    function clickProfile() {
      const profiles = document.querySelectorAll(".profile-js");
      profiles.forEach((profile) => {
        profile.addEventListener("click", (e) => {
          const userId = Number(profile.dataset.userId);
          const isChatExist = chatManager.isChatExist(loggedInUser.id, userId);
          if (isChatExist) {
            searchResult.classList.remove("search-result-popup");
            searchInput.value = "";
            console.log("chat exist");
            renderConversation(
              loggedInUser,
              isChatExist.id,
              (user, renderList) => self.render(user, renderList)
            );
            return;
          }
          const newChat = chatManager.createChat(loggedInUser.id);
          chatManager.createChatMembers(newChat.id, userId);
          chatManager.createChatMembers(newChat.id, loggedInUser.id);
          searchResult.classList.remove("search-result-popup");
          chatManager.save();
          searchInput.value = "";
          self.render(loggedInUser, renderConversation);
          renderConversation(loggedInUser, newChat.id, (user, renderList) =>
            self.render(user, renderList)
          );
        });
      });
    }

    function openConversation() {
      document.querySelectorAll(".conversation-js").forEach((convo) => {
        convo.addEventListener("click", () => {
          const chatId = Number(convo.dataset.chatId);
          console.log(chatId);
          renderConversation(loggedInUser, chatId, (user, renderList) =>
            self.render(user, renderList)
          );
        });
      });
    }
  }
}
