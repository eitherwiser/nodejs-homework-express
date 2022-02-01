const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const { contactsRouter, usersRouter } = require('./routes/');
const { joiContactValidation, joiUserValidation } = require('./middlewares/');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', joiContactValidation, contactsRouter);
app.use('/api/users', joiUserValidation, usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
