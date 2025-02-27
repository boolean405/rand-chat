const router = require("express").Router();

const {
  createOrAccessChat,
  createGroup,
  renameGroup,
  addUserToGroup,
  removeUserFromGroup,
  fetchChat,
} = require("../controllers/chat-controller");
const { ChatSchema } = require("../utils/schema");
const { validateToken, validateBody } = require("../utils/validator");

router
  .route("/")
  .post(
    validateToken(),
    validateBody(ChatSchema.createOrAccessChat),
    createOrAccessChat
  )
  .get(validateToken(), fetchChat);

router
  .route("/group/create")
  .post(validateToken(), validateBody(ChatSchema.createGroup), createGroup);
router
  .route("/group/rename")
  .patch(validateToken(), validateBody(ChatSchema.renameGroup), renameGroup);
router
  .route("/group/add")
  .patch(
    validateToken(),
    validateBody(ChatSchema.addUserToGroup),
    addUserToGroup
  );
router
  .route("/group/remove")
  .patch(
    validateToken(),
    validateBody(ChatSchema.removeUserFromGroup),
    removeUserFromGroup
  );

const chatRoute = router;

module.exports = {
  chatRoute,
};
