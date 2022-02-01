const Joi = require('joi');
const { BadRequest } = require('http-errors');
const { emailRegExp, phoneRegExp } = require('../../helpers');

const contactNew = Joi.object({
  name: Joi.string()
    .pattern(/^[a-z ,.'-]+$/i, 'name')
    .required(),
  email: Joi.string().regex(emailRegExp).required(),
  phone: Joi.string().regex(phoneRegExp).required(),
  favorite: Joi.bool().default(false),
});

const contactUpdate = Joi.object({
  name: Joi.string().pattern(/^[a-z ,.'-]+$/i, 'name'),
  email: Joi.string().regex(emailRegExp),
  phone: Joi.string().regex(phoneRegExp),
  favorite: Joi.bool(),
}).min(1);

const joiContactValidation = (req, res, next) => {
  if (req.method === 'POST') {
    const { error } = contactNew.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
  }
  if (req.method === 'PATCH' || req.method === 'PUT') {
    const { error } = contactUpdate.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
  }
  next();
};

module.exports = joiContactValidation;
