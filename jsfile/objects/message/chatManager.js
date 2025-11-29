import { chat, message, chatMembers } from "./objects.js";
import { getUser } from "../users.js";
import { formatTime } from "../../utils/format.js";

export class ChatManager {
  constructor() {
    this.formatTime = formatTime;
    this.chats = JSON.parse(localStorage.getItem("chats")) || [
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
    this.chatMessages = JSON.parse(localStorage.getItem("chatMessages")) || [
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
    this.chatMembersList = JSON.parse(
      localStorage.getItem("chatMembersList")
    ) || [
      new chatMembers(1, 1, users[0].id), // John is in chat 1
      new chatMembers(2, 1, users[1].id), // Jane is in chat 1

      // chat 2 members
      new chatMembers(3, 2, users[2].id), // Alice
      new chatMembers(4, 2, users[3].id), // Bob

      // chat 3 members
      new chatMembers(5, 3, users[4].id), // Carlos
      new chatMembers(6, 3, users[5].id), // Sophie

      // chat 4 members
      new chatMembers(7, 4, users[6].id), // Amit
      new chatMembers(8, 4, users[7].id), // Maria
    ];
  }

  // 🔹 Save all changes
  save() {
    localStorage.setItem("chats", JSON.stringify(this.chats));
    localStorage.setItem("chatMessages", JSON.stringify(this.chatMessages));
    localStorage.setItem(
      "chatMembersList",
      JSON.stringify(this.chatMembersList)
    );
  }

  // 🔹 Get a single chat
  getChat(chatId) {
    return this.chats.find((c) => c.id === chatId);
  }

  // 🔹 Get all chats for a user
  getChats(userId) {
    const result = [];
    this.chatMembersList.forEach((member) => {
      console.log(member.userId);
      if (member.userId === userId) {
        console.log(member.firstName);
        const chat = this.getChat(member.chatId);
        if (chat) result.push(chat);
      }
      console.log("aklhsd");
    });
    return result;
  }

  // 🔹 Get chat members
  getChatMembers(chatId) {
    return this.chatMembersList.filter((m) => m.chatId === chatId);
  }

  // 🔹 Get chat messages
  getChatMessages(chatId) {
    return this.chatMessages.filter((m) => m.chatId === chatId);
  }

  // 🔹 Get latest message
  getLatestMessage(chatId) {
    const messages = this.getChatMessages(chatId);
    if (messages.length === 0) return null;
    return messages.reduce((latest, msg) =>
      msg.timestamp > latest.timestamp ? msg : latest
    );
  }

  // 🔹 Check if chat exists between two users
  isChatExist(userAId, userBId) {
    //Nag lagay ako comments nalilito ako sa mga shortcuts
    return this.chats.some((chat) => {
      const ids = members.map((m) => m.userId);
      // returns members on the existing chat
      const members = this.getChatMembers(chat.id); // returns the userId's of the existing chat
      return ids.includes(userAId) && ids.includes(userBId); // if it has the loggedInUserId and the userId it returns true
    });
  }

  // 🔹 Format time

  // 🔹 Set chat name (for private 1-on-1)
  setChatName(loggedInUser, chat) {
    const members = this.getChatMembers(chat.id);
    const otherMember = members.find((m) => m.userId !== loggedInUser.id);
    if (!otherMember) return "Unknown Chat";
    const user = getUser(otherMember.userId);
    return `${user.firstName} ${user.lastName}`;
  }
}
