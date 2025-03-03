const router = require("express").Router();

const {
  sendMessage,
  allMessages,
} = require("../controllers/message-controller");
const { MessageSchema, AllSchema } = require("../utils/schema");
const {
  validateToken,
  validateParam,
  validateBody,
} = require("../utils/validator");

router
  .route("/")
  .post(validateToken(), validateBody(MessageSchema.sendMessage), sendMessage);

router
  .route("/:chatId")
  .get(
    validateToken(),
    validateParam(MessageSchema.params.chatId, "chatId"),
    allMessages
  );

module.exports = router
