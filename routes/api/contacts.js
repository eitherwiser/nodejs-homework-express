const express = require('express')
const router = express.Router()
const { NotFound } = require('http-errors');

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../../model')


router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json({
      status: 'success',
      code: 200,
      data: { contacts }
    });
  }
  catch (error) {
    next(error);
  }
})

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);
    if (!contact) {
      throw new NotFound();
    }
    else {
      res.json({
        status: 'success',
        code: 200,
        data: contact
      });
    }
  }
  catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newContact = await addContact(req.body);
    res.json({
      status: 'success',
      code: 200,
      data: newContact
    });
  }
  catch (error) {
    next(error);
  }
})

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await removeContact(contactId);
    if (!result) {
      throw new NotFound();
    }
    res.json({
      status: 'success',
      code: 200,
      message: 'contact deleted'
    })
  }
  catch (error) {
    next(error)
  }
})

router.patch('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await updateContact(contactId, req.body);
    if (!contact) {
      throw new NotFound();
    } else {
      res.json({
        status: 'success',
        code: 200,
        data: contact
      })
    }
  }
  catch (error) {
    next(error)
  }
})

module.exports = router;
