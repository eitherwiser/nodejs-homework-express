const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs/promises');
const { Conflict, Unauthorized } = require('http-errors');

require('dotenv').config();
const { SECRET_KEY } = process.env;
const { User } = require('../../models/');
const { authenticate, upload } = require('../../middlewares/');
const { avatarsDir } = require('../../constants/');
const { renameFile, imgNormalize } = require('../../helpers/');

// signup user
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, subscription } = req.body;
    const result = await User.findOne({ email });
    if (result) {
      throw new Conflict('Email in use');
    }

    const newUser = new User({ email, subscription });
    await newUser.setPassword(password);
    await newUser.setAvatarURL(email);
    await newUser.save();

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
});

// login user
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Unauthorized('Email or password is wrong');
    }
    const passwordCompare = await user.comparePassword(password);
    if (!passwordCompare) {
      throw new Unauthorized('Email or password is wrong');
    }

    const { _id, subscription } = user;
    const payload = { id: _id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    await User.findByIdAndUpdate(_id, { token });

    res.json({
      token,
      user: { email, subscription },
    });
  } catch (error) {
    next(error);
  }
});

// user logout
router.get('/logout', authenticate, async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate({ _id }, { token: null });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
});

// subscription
router.get('/current', authenticate, async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/', authenticate, async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { subscription } = req.body;
    const newSubscription = await User.findOneAndUpdate(
      { _id },
      { subscription },
      {
        new: true,
        select: '-createdAt -updatedAt -password -token',
      },
    );

    res.json({
      status: 'updated',
      code: 200,
      message: `subscription updated to ${subscription}`,
      data: { User: newSubscription },
    });
  } catch (error) {
    next(error);
  }
});

//! add helper for rename picture

// avatar upload
router.patch(
  '/avatars',
  [authenticate, upload.single('avatar')],
  async (req, res, next) => {
    try {
      const id = req.user._id;
      const { path: tempUpload, filename } = req.file;
      const newFileName = await renameFile(filename, id);
      const fileUpload = await path.join(avatarsDir, newFileName);
      await imgNormalize(tempUpload, 'avatar');
      await fs.rename(tempUpload, fileUpload);
      const avatarURL = path.join('./public/avatars', newFileName);
      await User.findByIdAndUpdate(
        req.user._id,
        { avatarURL },
        {
          new: true,
          select: '-createdAt -updatedAt -password -subscription -token',
        },
      );

      res.json({
        status: 'updated',
        code: 200,
        data: { User: avatarURL },
      });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
