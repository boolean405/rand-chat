const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, require: true },
    username: { type: String, unique: true },
    email: { type: String, require: true, unique: true },
    phone: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    picture: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate the username
UserSchema.pre("save", function (next) {
  if (!this.username) {
    const randomNumber = Math.floor(Math.random() * 1000); // generate random number
    this.username = `${this.name}${randomNumber}`.toLowerCase();
  }
  next();
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
