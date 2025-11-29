import { users } from "../users.js";

export class ChatManager {
  constructor() {
    this.chats = JSON.parse(localStorage.getItem("chats")) || [
      {
        id: 1,
        chatName: "",
        createdBy: users[0].id,
        createdAt: Date.now() - 1000 * 60 * 60 * 24,
      },
      {
        id: 2,
        chatName: "",
        createdBy: users[2].id,
        createdAt: Date.now() - 1000 * 60 * 60 * 12,
      },
      {
        id: 3,
        chatName: "",
        createdBy: users[4].id,
        createdAt: Date.now() - 1000 * 60 * 60 * 6,
      },
      {
        id: 4,
        chatName: "",
        createdBy: users[6].id,
        createdAt: Date.now() - 1000 * 60 * 60 * 2,
      },
    ];

    this.chatMessages = JSON.parse(localStorage.getItem("chatMessages")) || [
      {
        id: 1,
        chatId: 1,
        senderId: users[0].id,
        message: "Hey Jane, are you free for lunch tomorrow?",
        timestamp: Date.now() - 1000 * 60 * 60 * 23,
        isRead: true,
      },
      {
        id: 2,
        chatId: 1,
        senderId: users[1].id,
        message:
          "Hi John — yes, midday works for me. Where do you want to meet?",
        timestamp: Date.now() - 1000 * 60 * 60 * 22,
        isRead: true,
      },
      {
        id: 3,
        chatId: 1,
        senderId: users[0].id,
        message: "How about the cafe near the park at 12:30?",
        timestamp: Date.now() - 1000 * 60 * 60 * 21,
        isRead: false,
      },
      {
        id: 4,
        chatId: 1,
        senderId: users[1].id,
        message: "Perfect — see you then!",
        timestamp: Date.now() - 1000 * 60 * 60 * 20,
        isRead: false,
      },
      {
        id: 5,
        chatId: 2,
        senderId: users[2].id,
        message: "Hey Bob, did you finish the report?",
        timestamp: Date.now() - 1000 * 60 * 60 * 11,
        isRead: true,
      },
      {
        id: 6,
        chatId: 2,
        senderId: users[3].id,
        message: "Almost done; I'll send it by tonight.",
        timestamp: Date.now() - 1000 * 60 * 60 * 10,
        isRead: false,
      },
      {
        id: 7,
        chatId: 3,
        senderId: users[4].id,
        message: "Sophie, can you review the design mockups?",
        timestamp: Date.now() - 1000 * 60 * 60 * 5,
        isRead: false,
      },
      {
        id: 8,
        chatId: 3,
        senderId: users[5].id,
        message: "On it — I'll give feedback in an hour.",
        timestamp: Date.now() - 1000 * 60 * 60 * 4.5,
        isRead: false,
      },
      {
        id: 9,
        chatId: 4,
        senderId: users[6].id,
        message: "Maria, are you joining the call at 3pm?",
        timestamp: Date.now() - 1000 * 60 * 60 * 1.5,
        isRead: false,
      },
      {
        id: 10,
        chatId: 4,
        senderId: users[7].id,
        message: "Yes — I'll be there in 5 minutes.",
        timestamp: Date.now() - 1000 * 60 * 60 * 1,
        isRead: false,
      },
    ];

    this.chatMembers = JSON.parse(localStorage.getItem("chatMembersList")) || [
      { chatId: 1, userId: users[0].id },
      { chatId: 1, userId: users[1].id },
      { chatId: 2, userId: users[2].id },
      { chatId: 2, userId: users[3].id },
      { chatId: 3, userId: users[4].id },
      { chatId: 3, userId: users[5].id },
      { chatId: 4, userId: users[6].id },
      { chatId: 4, userId: users[7].id },
    ];
  }

  // ======= Utility methods =======

  save() {
    localStorage.setItem("chats", JSON.stringify(this.chats));
    localStorage.setItem("chatMessages", JSON.stringify(this.chatMessages));
    localStorage.setItem("chatMembersList", JSON.stringify(this.chatMembers));
  }

  clear() {
    localStorage.removeItem("chats");
    localStorage.removeItem("chatMessages");
    localStorage.removeItem("chatMembersList");
  }

  // ======= CRUD operations =======

  createChat(createdBy) {
    const newChat = {
      id: this.chats.length + 1,
      chatName: "",
      createdBy,
      createdAt: Date.now(),
    };
    this.chats.push(newChat);
    return newChat;
  }

  createChatMembers(chatId, userId) {
    const newChatMember = { chatId, userId };
    this.chatMembers.push(newChatMember);
    console.log("chat member:", newChatMember);
    return newChatMember;
  }

  createMessage(chatId, senderId, message) {
    const newMessage = {
      id: this.chatMessages.length + 1,
      chatId,
      senderId,
      message,
      timestamp: Date.now(),
      isRead: false,
    };
    this.chatMessages.push(newMessage);
    return newMessage;
  }

  // ======= Getters =======

  getChat(chatId) {
    return this.chats.find((c) => c.id === chatId);
  }

  getChats(userId) {
    // Step 1: Find chats that include the user
    const userChats = [];

    for (const member of this.chatMembers) {
      if (member.userId === userId) {
        const chat = this.chats.find((c) => c.id === member.chatId);
        if (chat) {
          userChats.push(chat);
        }
      }
    }

    // Step 2: Sort chats by latest message (newest first)
    userChats.sort((chatA, chatB) => {
      // Get all messages for each chat
      const messagesA = this.chatMessages.filter((m) => m.chatId === chatA.id);
      const messagesB = this.chatMessages.filter((m) => m.chatId === chatB.id);

      // Find latest message time or use chat creation time
      let latestA;
      if (messagesA.length > 0) {
        const lastMessageA = messagesA[messagesA.length - 1];
        latestA = lastMessageA.timestamp;
      } else {
        latestA = chatA.createdAt;
      }

      let latestB;
      if (messagesB.length > 0) {
        const lastMessageB = messagesB[messagesB.length - 1];
        latestB = lastMessageB.timestamp;
      } else {
        latestB = chatB.createdAt;
      }

      // Newest chats come first
      return latestB - latestA;
    });

    // Step 3: Return the sorted list
    return userChats;
  }

  getChatMembers(chatId) {
    return this.chatMembers.filter((m) => m.chatId === chatId);
  }

  getChatMessages(chatId) {
    return this.chatMessages.filter((m) => m.chatId === chatId);
  }

  isChatExist(userA, userB) {
    return (
      this.chats.find((chat) => {
        const members = this.getChatMembers(chat.id);
        const memberIds = members.map((m) => m.userId);
        return memberIds.includes(userA) && memberIds.includes(userB);
      }) || null
    );
  }

  // ======= Helpers =======

  getLatestMessage(messages) {
    if (!messages || messages.length === 0) return "New Chat.";
    return messages.reduce((latest, msg) =>
      msg.timestamp > latest.timestamp ? msg : latest
    );
  }

  formatTime(timestamp) {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  setChatName(loggedInUser, chat) {
    const members = this.getChatMembers(chat.id);
    const otherMember = members.find((m) => m.userId !== loggedInUser.id);
    if (!otherMember) return "Unknown Chat";
    const memberUser = users.find((u) => u.id === otherMember.userId);
    return `${memberUser.firstName} ${memberUser.lastName}`;
  }

  getConversationWith(chat, loggedInUser) {
    const members = this.getChatMembers(chat.id);
    const other = members.find((m) => m.userId !== loggedInUser.id);
    if (!other) return null;
    return users.find((u) => u.id === other.userId);
  }
}

export const chatManager = new ChatManager();
