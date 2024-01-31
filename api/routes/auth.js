const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_EXPIRY = '120s';
// REFRESH TOKEN
let refreshTokens = [];

router.post('/refresh', (req, res) => {
  // TODO : Since this has a route and if refreshToken is in localstorage how is this secure?
  // Would cookie be better to keep the refresdhToken?  accessToken will alway just be stored in memory of user object?
  // Will this work ok with Context and how it is using localStorage?

  // take the refresh token from the user
  const refreshToken = req.body.token;
  // send error if no token / not valid

  if (!refreshToken) return res.status(401).json('You are not authenticated!');
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json('Refresh token is not valid!');
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    err && console.log(err);

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
  // all good, create new access token
});

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_KEY, {
    expiresIn: JWT_EXPIRY,
  });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_KEY);
};

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save();
    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    !user && res.status(400).json('Wrong credentials!');

    if (user) {
      const validated = await bcrypt.compare(req.body.password, user.password);
      if (validated) {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        console.log(
          'ACCESS TOKEN',
          accessToken,
          ' REFRESH TOKEN',
          refreshToken
        );
        refreshTokens.push(refreshToken);

        // remove password from response
        const { password, ...others } = user._doc;

        //  TODO : Maybe here instead update the user object with the tokens
        // Should leave refreshToken in object though?
        others.accessToken = accessToken;
        others.refreshToken = refreshToken;

        res.status(200).json(others);
      } else {
        res.status(400).json('Nope.');
      }
    }
  } catch (error) {
    // console.log(error);
    res.status(500).json(error);
  }
});
module.exports = router;
