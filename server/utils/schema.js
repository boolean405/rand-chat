const Joi = require("joi");

const UserSchema = {
  register: Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "me", "org"] },
      })
      .required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+={}|:"<>?\\,-.]{4,30}$'))
      .required(),
  }),
  login: Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "me", "org"] },
      })
      .required(),
    // phone: Joi.string().pattern(/^[0-9]{10}$/),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+={}|:"<>?\\,-.]{4,30}$'))
      .required(),
  }),
  userId: Joi.object({
    userId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
  params: {
    userId: Joi.object({
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },
};

const ChatSchema = {
  createOrAccessChat: Joi.object({
    receiverId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
  createGroup: Joi.object({
    users: Joi.string().required(),
    groupName: Joi.string().min(4).required(),
  }),
  renameGroup: Joi.object({
    chatId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    groupName: Joi.string().min(4).required(),
  }),
  addUserToGroup: Joi.object({
    userId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    chatId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
  removeUserFromGroup: Joi.object({
    userId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    chatId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};

const MessageSchema = {
  sendMessage: Joi.object({
    chatId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    content: Joi.string().required(),
  }),
  params: {
    chatId: Joi.object({
      chatId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },
};
module.exports = {
  UserSchema,
  ChatSchema,
  MessageSchema,
};
