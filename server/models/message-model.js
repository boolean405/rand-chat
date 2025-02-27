const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, require: true, ref: "user" },
    // receiver: { type: Schema.Types.ObjectId, require: true, ref: "user" },
    type: {
      type: String,
      require: true,
      enum: ["text", "image"],
      default: "text",
    },
    content: { type: String, require: true, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "chat" },
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ sender: 1, chat: 1 });
MessageSchema.index({ type: 1 });

const MessageModel = mongoose.model("message", MessageSchema);

module.exports = MessageModel;
