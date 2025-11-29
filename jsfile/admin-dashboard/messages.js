import { renderMessagesConversation } from "./messages/messages-conversation.js";
import { renderMessagesList } from "./messages/messages-list.js";
import { loggedInUser } from "../objects/loggedInUser.js";

renderMessagesList(loggedInUser, renderMessagesConversation);
renderMessagesConversation(loggedInUser);
