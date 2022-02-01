const joiUserValidation = require('./validation/userValidation.js');
const joiContactValidation = require('./validation/contactValidation.js');
const authenticate = require('./authorization/authorization.js');

module.exports = {
  joiUserValidation,
  joiContactValidation,
  authenticate,
};
