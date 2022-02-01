const { Schema, model } = require('mongoose');

const { emailRegExp, phoneRegExp } = require('../helpers');

const contactSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for the contact'],
    },
    email: {
      type: String,
      match: emailRegExp,
      required: [true, 'Email is required'],
      unique: true,
    },
    phone: {
      type: String,
      match: phoneRegExp,
      required: [true, 'Phone number is required'],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamp: true },
);

const Contact = model('contact', contactSchema);

module.exports = Contact;
