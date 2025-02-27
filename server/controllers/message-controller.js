const MessageDB = require("../models/message-model");
const ChatDB = require("../models/chat-model");
const UserDB = require("../models/user-model");
const { resMsg } = require("../utils/core");

const sendMessage = async (req, res, next) => {
  try {
    const { chatId, content } = req.body;
    const dbChat = await ChatDB.findById(chatId);

    if (!dbChat) {
      const error = new Error("Chat data not found with that id!");
      error.status = 404;
      return next(error);
    }

    let newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    let message = await MessageDB.create(newMessage);
    message = await MessageDB.findById(message._id)
      .populate("sender", "-password")
      .populate("chat");
    message = await UserDB.populate(message, {
      path: "chat.users",
      select: "-password",
    });

    await ChatDB.findByIdAndUpdate(chatId, { latestMessage: message });
    resMsg(res, "Send message", message);
  } catch (err) {
    const error = new Error(err.message);
    error.status = 404;
    return next(error);
  }
};

const allMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const dbChat = await ChatDB.findById(chatId);

    if (!dbChat) {
      const error = new Error("Chat data not found with that id!");
      error.status = 404;
      return next(error);
    }

    const messages = await MessageDB.find({
      chat: chatId,
    })
      .populate({
        path: "sender",
        select: "-password",
      })
      .populate({
        path: "chat",
        populate: {
          path: "users",
          select: "-password",
        },
      })
      .sort({ createdAt: -1 });

    resMsg(res, "All messages with that chat id", messages);
  } catch (err) {
    const error = new Error(err.message);
    error.status = 404;
    return next(error);
  }
};

module.exports = { sendMessage, allMessages };
