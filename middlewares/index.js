const joiUserValidation = require('./validation/userValidation.js');
const joiContactValidation = require('./validation/contactValidation.js');
const authenticate = require('./authorization/authorization.js');
const upload = require('./upload/uploadFile.js');

module.exports = {
  joiUserValidation,
  joiContactValidation,
  authenticate,
  upload,
};
