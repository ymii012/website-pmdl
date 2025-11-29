import { users } from "../users.js";

export class ChatManager {
  constructor() {
    //JSON.parse(localStorage.getItem("chats")) ||
    this.chats = [
      // 1-on-1 chat between users[0] (John Doe) and users[1] (Jane Smith)
      new chat(
        1,
        ``, // chat name shows the other user
        users[0].id, // createdBy = John Doe
        Date.now() - 1000 * 60 * 60 * 24 // created yesterday
      ),

      // 1-on-1 chat between users[2] (Alice Brown) and users[3] (Bob Wilson)
      new chat(
        2,
        ``,
        users[2].id,
        Date.now() - 1000 * 60 * 60 * 12 // ~12 hours ago
      ),

      // 1-on-1 chat between users[4] (Carlos Martinez) and users[5] (Sophie Lee)
      new chat(
        3,
        ``,
        users[4].id,
        Date.now() - 1000 * 60 * 60 * 6 // ~6 hours ago
      ),

      // 1-on-1 chat between users[6] (Amit Patel) and users[7] (Maria García)
      new chat(
        4,
        ``,
        users[6].id,
        Date.now() - 1000 * 60 * 60 * 2 // ~2 hours ago
      ),
    ];
    //JSON.parse(localStorage.getItem("chatMessages")) ||
    this.chatMessages = [
      new message(
        1,
        1, // chatId
        users[0].id, // sender John
        "Hey Jane, are you free for lunch tomorrow?",
        Date.now() - 1000 * 60 * 60 * 23, // ~23 hours ago
        true
      ),
      new message(
        2,
        1,
        users[1].id, // sender Jane
        "Hi John — yes, midday works for me. Where do you want to meet?",
        Date.now() - 1000 * 60 * 60 * 22, // ~22 hours ago
        true
      ),
      new message(
        3,
        1,
        users[0].id,
        "How about the cafe near the park at 12:30?",
        Date.now() - 1000 * 60 * 60 * 21, // ~21 hours ago
        false
      ),
      new message(
        4,
        1,
        users[1].id,
        "Perfect — see you then!",
        Date.now() - 1000 * 60 * 60 * 20, // ~20 hours ago
        false
      ),

      // Chat 2 messages (Alice <-> Bob)
      new message(
        5,
        2,
        users[2].id,
        "Hey Bob, did you finish the report?",
        Date.now() - 1000 * 60 * 60 * 11, // ~11 hours ago
        true
      ),
      new message(
        6,
        2,
        users[3].id,
        "Almost done; I'll send it by tonight.",
        Date.now() - 1000 * 60 * 60 * 10, // ~10 hours ago
        false
      ),

      // Chat 3 messages (Carlos <-> Sophie)
      new message(
        7,
        3,
        users[4].id,
        "Sophie, can you review the design mockups?",
        Date.now() - 1000 * 60 * 60 * 5, // ~5 hours ago
        false
      ),
      new message(
        8,
        3,
        users[5].id,
        "On it — I'll give feedback in an hour.",
        Date.now() - 1000 * 60 * 60 * 4.5, // ~4.5 hours ago
        false
      ),

      // Chat 4 messages (Amit <-> Maria)
      new message(
        9,
        4,
        users[6].id,
        "Maria, are you joining the call at 3pm?",
        Date.now() - 1000 * 60 * 60 * 1.5, // ~1.5 hours ago
        false
      ),
      new message(
        10,
        4,
        users[7].id,
        "Yes — I'll be there in 5 minutes.",
        Date.now() - 1000 * 60 * 60 * 1, // ~1 hour ago
        false
      ),
    ];
    //JSON.parse(localStorage.getItem("chatMembersList")) ||
    this.chatMembers = [
      new chatMembers(1, users[0].id), // John is in chat 1
      new chatMembers(1, users[1].id), // Jane is in chat 1

      // chat 2 members
      new chatMembers(2, users[2].id), // Alice
      new chatMembers(2, users[3].id), // Bob

      // chat 3 members
      new chatMembers(3, users[4].id), // Carlos
      new chatMembers(3, users[5].id), // Sophie

      // chat 4 members
      new chatMembers(4, users[6].id), // Amit
      new chatMembers(4, users[7].id), // Maria
    ];
  }

  // ======= Utility methods =======

  /*
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
  */

  // ======= CRUD operations =======

  createChat(createdBy) {
    const newChat = new chat(this.chats.length + 1, "", createdBy, Date.now());
    this.chats.push(newChat);
    return newChat;
  }

  createChatMembers(chatId, userId) {
    const newChatMember = new chatMembers(chatId, userId);
    this.chatMembers.push(newChatMember);
    console.log("chat member:", newChatMember);
    return newChatMember;
  }

  createMessage(chatId, senderId, message) {
    const newMessage = new message(
      this.chatMessages.length + 1,
      chatId,
      senderId,
      message,
      Date.now(),
      false
    );
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
    return this.chats.some((chat) => {
      const members = this.getChatMembers(chat.id);
      const memberIds = members.map((m) => m.userId);
      return memberIds.includes(userA) && memberIds.includes(userB);
    });
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
