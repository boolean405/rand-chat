const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const resMsg = (res, msg = "", result = []) => {
  res.status(200).json({
    con: true,
    msg,
    result,
  });
};

const Encoder = {
  encode: (password) => bcrypt.hashSync(password, 10),
  compare: (plain, hash) => bcrypt.compareSync(plain, hash),
};

const Token = {
  makeToken: (payload) =>
    jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' }),
  verifyToken: (token) => jwt.verify(token, process.env.SECRET_KEY),
};

module.exports = {
  resMsg,
  Encoder,
  Token,
};
