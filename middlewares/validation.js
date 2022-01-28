const Joi = require('joi');
const { BadRequest } = require('http-errors');

const contactNew = Joi.object({
  name: Joi.string()
    .pattern(/^[a-z ,.'-]+$/i, 'name')
    .required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$/)
    .required(),
  favorite: Joi.bool(),
});

const contactUpdate = Joi.object({
  name: Joi.string().pattern(/^[a-z ,.'-]+$/i, 'name'),
  email: Joi.string().email(),
  phone: Joi.string().regex(
    /^[+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$/,
  ),
  favorite: Joi.bool(),
}).min(1);

const contactValidation = (req, res, next) => {
  if (req.method === 'POST') {
    const { error } = contactNew.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
  } else if (req.method === 'PATCH' || req.method === 'PUT') {
    const { error } = contactUpdate.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
  }
  next();
};

module.exports = { contactValidation };
