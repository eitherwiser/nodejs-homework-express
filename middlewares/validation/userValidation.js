const Joi = require('joi');
const { BadRequest } = require('http-errors');
const { emailRegExp } = require('../../helpers');

const userSignup = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().min(6).required(),
  avatarURL: Joi.string(),
  subscription: Joi.string().default('starter'),
});

const userLogin = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().min(6).required(),
});

const userSubscription = Joi.object({
  subscription: Joi.string().valid('starter', 'business', 'pro').required(),
});

const userAvatarUpdate = Joi.object({
  avatarURL: Joi.string().required(),
});

const errorWrapper = validationResult => {
  const { error } = validationResult;
  if (error) {
    throw new BadRequest(error.message);
  }
};

// !remake with try-catch

const joiUserValidation = (req, res, next) => {
  if (req.method === 'POST') {
    if (req.originalUrl === '/api/users/signup') {
      errorWrapper(userSignup.validate(req.body));
    }
    if (req.originalUrl === '/api/users/login') {
      errorWrapper(userLogin.validate(req.body));
    }
  }
  if (req.method === 'PATCH') {
    if (req.originalUrl === '/api/users/avatars') {
      errorWrapper(userAvatarUpdate.validate(req.body));
    }
    if (req.originalUrl === '/api/users/') {
      errorWrapper(userSubscription.validate(req.body));
    }
  }
  next();
};

module.exports = joiUserValidation;
