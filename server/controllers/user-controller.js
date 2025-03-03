const UserDB = require("../models/user-model");
const Redis = require("../utils/redis");
const { resMsg, Encoder, Token } = require("../utils/core");

const paginateUser = async (req, res, next) => {
  try {
    const pageNum = Number(req.params.pageNum);
    if (!pageNum) {
      const error = new Error(`Page no. must be number!`);
      error.status = 400;
      return next(error);
    }
    if (pageNum <= 0) {
      const error = new Error(`Page Number must be greater than 0!`);
      error.status = 400;
      return next(error);
    }
    const limit = Number(process.env.PAGINATE_LIMIT);
    const reqPage = pageNum == 1 ? 0 : pageNum - 1;

    const skipCount = limit * reqPage;
    const totalUser = await UserDB.countDocuments();
    const user = await UserDB.find()
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(limit)
      .select("-password");
    resMsg(
      res,
      `${user.length} users paginated of total ${totalUser} users, max ${limit} users per page`,
      user
    );
  } catch (err) {
    const error = new Error(err.message);
    error.status = 404;
    return next(error);
  }
};

const register = async (req, res, next) => {
  try {
    let { name, email, phone, password } = req.body;
    email = email.toLowerCase();

    const dbEmailUser = await UserDB.findOne({ email });
    if (dbEmailUser) {
      const error = new Error("Email already in use!");
      error.status = 401;
      return next(error);
    }

    let dbPhoneUser = await UserDB.findOne({ phone });
    if (dbPhoneUser) {
      const error = new Error("Phone already in use!");
      error.status = 401;
      return next(error);
    }
    // Password Encryption
    let encodedPassword = Encoder.encode(password);
    const registeredUser = await UserDB.create({
      name,
      email,
      phone,
      password: encodedPassword,
    });
    const user = await UserDB.findById(registeredUser._id).select("-password");
    resMsg(res, "Register Success", user);
  } catch (err) {
    const error = new Error(err.message);
    error.status = 404;
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let dbUser = await UserDB.findOne({ email });
    if (!dbUser) {
      const error = new Error("No user found with that email!");
      error.status = 404;
      return next(error);
    }

    const correctPassword = Encoder.compare(password, dbUser.password);
    if (!correctPassword) {
      const error = new Error("Incorrect password!");
      error.status = 401;
      return next(error);
    }

    let user = dbUser.toObject();
    delete user.password;
    await Redis.set(user._id.toString(), user);
    user.token = Token.makeToken({ id: user._id.toString() });
    resMsg(res, "Login success", user);
  } catch (err) {
    const error = new Error(err.message);
    error.status = 404;
    return next(error);
  }
};

const profile = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    const error = new Error("No login user!");
    error.status = 404;
    return next(error);
  }
  resMsg(res, "User profile", user);
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await UserDB.findById(userId);
    if (!user) {
      const error = new Error("No user found with that id!");
      error.status = 404;
      return next(error);
    }
    if (await Redis.get(userId)) {
      await Redis.delete(userId);
    }
    await UserDB.findByIdAndDelete(userId);
    resMsg(res, `'${user.name}' user deleted`);
  } catch (err) {
    const error = new Error(err.message);
    error.status = 404;
    return next(error);
  }
};

const searchUser = async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { userName: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await UserDB.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");
  resMsg(res, "Search user with keyword", users);
};

module.exports = {
  paginateUser,
  register,
  login,
  profile,
  deleteUser,
  searchUser,
};
