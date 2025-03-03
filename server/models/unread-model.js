const mongoose = require("mongoose");
const { appDbConnection } = require("../utils/db");
const { Schema } = mongoose;

const UnreadSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, require: true, ref: "user" },
    receiver: { type: Schema.Types.ObjectId, require: true, ref: "user" },
  },
  {
    timestamps: true,
  }
);

const UnreadModel = appDbConnection.model("unread", UnreadSchema);

module.exports = UnreadModel;
