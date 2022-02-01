const express = require('express');
const router = express.Router();
const { NotFound } = require('http-errors');

const { Contact } = require('../../models');

router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.json({
      status: 'success',
      code: 200,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId);
    if (!contact) {
      throw new NotFound();
    } else {
      res.json({
        status: 'success',
        code: 200,
        data: contact,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const bodyValidation = () => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'favorite')) {
      return { ...req.body, favorite: 'false' };
    }
    return req.body;
  };
  try {
    const newContact = await Contact.create(bodyValidation());
    res.json({
      status: 'success',
      code: 200,
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
      throw new NotFound();
    }
    res.json({
      status: 'success',
      code: 200,
      message: 'contact deleted',
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!contact) {
      throw new NotFound();
    } else {
      res.json({
        status: 'success',
        code: 200,
        data: contact,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'favorite')) {
      res.status(400).json({
        status: 'Bad Request',
        code: 400,
        message: 'missing field favorite',
      });
    } else {
      const { contactId } = req.params;
      const { favorite } = req.body;
      const contact = await Contact.findByIdAndUpdate(
        contactId,
        { favorite },
        { new: true },
      );
      res.json({
        status: 'success',
        code: 200,
        message: 'contact status updated',
        data: contact,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
