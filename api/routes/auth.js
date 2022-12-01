const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
// Register

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
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('from auth.js api');

    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json('Wrong credentials!');
    const validated = await bcrypt.compare(req.body.password, user.password);

    !validated && res.status(400).json('Wrong credentials!');

    // remove password from response
    const { password, ...others } = user._doc;
    // trying to return here for  Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    return res.status(200).json(others);
  } catch (error) {
    return res.status(500).json(error);
  }
});
module.exports = router;
