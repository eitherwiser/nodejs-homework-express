const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

const { emailRegExp } = require('../helpers');

const userSchema = Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      match: emailRegExp,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'business', 'pro'],
      default: 'starter',
    },
    avatarURL: {
      type: String,
      default: '/no-picture.svg',
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.methods.setPassword = async function (password) {
  try {
    this.password = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  } catch (error) {
    throw new Error(error.message);
  }
};

userSchema.methods.setAvatarUrl = async function (email) {
  try {
    this.avatarURL = await gravatar.url(email, {
      protocol: 'http',
      s: '100',
      d: 'retro',
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compareSync(password, this.password);
};

const User = model('user', userSchema);

module.exports = User;
