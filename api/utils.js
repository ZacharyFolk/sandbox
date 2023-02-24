const jwt = require('jsonwebtoken');

// VERIFY
const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('authHeader: ', authHeader);

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
      if (err) {
        return res.status(403).json('Token is not valid!');
      }
      console.log('Success! Token is validated.');
      req.payload = payload;
      next();
    });
  } else {
    res.status(401).json('You are not authenticated!');
  }
};

module.exports = verify;
