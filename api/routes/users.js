const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Refresh token
let refreshTokens = [];
// VERIFY
const verify = (req, res, next) => {
  console.log('<===================== VERIFY =====================>');
  const authHeader = req.headers.authorization;
  console.log('authHeader: ', authHeader);

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
      if (err) {
        return res.status(403).json('Token is not valid!');
      }
      console.log('Success! Token is validated.');

      console.log(payload);

      req.payload = payload;
      // console.log(res);
      next();
    });
  } else {
    res.status(401).json('You are not authenticated!');
  }
};
// UPDATE
router.put('/:id', verify, async (req, res) => {
  console.log('reached update user');

  console.log('req.payload.id check', req.payload.id, ' === ', req.params.id);
  if (req.payload.id === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true } // sends updated user in response not original
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(401).json('You can only update your own account!');
  }
});

// DELETE

router.delete('/:id', verify, async (req, res) => {
  console.log('<===================== DELETE =====================>');

  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  console.log('Refresh Tokens from Delete :', refreshTokens);
  res.status(200).json('User has been deleted...');

  if (req.payload.id === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        //   await Post.deleteMany({ username: user.username });
        //    await User.findByIdAndDelete(req.params.id);
        console.log(
          'THE IDS ARE MATCHING!',
          req.payload.id,
          '===',
          req.params.id
        );

        res.status(200).json('User has been deleted... (not really) ');
      } catch (error) {
        res.status(500).json(error);
      }
    } catch (error) {
      res.status(404).json('User not found');
    }
  } else {
    console.log(
      'THE IDS ARE NOT MATCHING!',
      req.payload.id,
      ' != ',
      req.params.id
    );

    res.status(401).json('You can only delete your own account!');
  }
});

// GET USER

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
