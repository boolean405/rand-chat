const router = require("express").Router();

const {
  paginateUser,
  login,
  register,
  profile,
  searchUser,
  deleteUser,
} = require("../controllers/user-controller");
const { UserSchema } = require("../utils/schema");
const {
  validateToken,
  validateParam,
  validateBody,
} = require("../utils/validator");

router
  .route("/")
  .post(validateBody(UserSchema.register), register)
  .get(validateToken(), searchUser);

router.post("/login", [validateBody(UserSchema.login), login]);
router.get("/paginate/:pageNum", paginateUser);
router.get("/profile", [validateToken(), profile]);

router.delete("/", [
  validateToken(),
  // validateParam(UserSchema.params.userId, "userId"),
  validateBody(UserSchema.userId),
  deleteUser,
]);

const userRoute = router;

module.exports = {
  userRoute,
};
