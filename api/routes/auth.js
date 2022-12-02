const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
// Register
const jwt = require('jsonwebtoken');
router.post('/register', async (req, res) => {
  console.log('reached the register api');
  console.log(req.body);
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save();
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_KEY);
    console.log('USER');
    console.log(user);
    console.log(
      '=============================================================='
    );

    const { password, ...others } = user._doc;

    others.token = accessToken;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    !user && res.status(400).json('Wrong credentials!');

    if (user) {
      const validated = await bcrypt.compare(req.body.password, user.password);
      if (validated) {
        console.log('Success, logged in');
        console.log(user);
        // Generate an access token

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_KEY);

        //console.log(user._doc);
        // remove password from response
        const { password, ...others } = user._doc;

        // to debug but otherwise do not include the token in the response!!
        // others.token = accessToken;
        res.status(200).json(others);
      } else {
        res.status(400).json('Nope.');
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
