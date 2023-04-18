const router = require('express').Router();
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator');

require('dotenv').config();

let transporter = nodemailer.createTransport({
  host: process.env.MAIL_ROUTE,
  port: 465,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },

  // # SENDGRID integration - works
  // host: 'smtp.sendgrid.net',
  // port: 465,
  // auth: {
  //   user: process.env.SENDGRID_USER,
  //   pass: process.env.SENDGRID_API,
  // },
});
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('From emailRoute, SMTP Server is ready to take messages');
  }
});

router.post(
  '/send',
  [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Email is not valid'),
    check('message').not().isEmpty().withMessage('Message is required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;

    var content = `New message from : ${name} \n \n email: ${email} \n message: \n ${message} `;
    var mail = {
      from: 'zachary@folkphotography.com',
      to: 'folkcodes@gmail.com',
      subject: 'Message from Zacs.Website!',
      text: content,
    };
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.json({
          status: 'fail',
        });
      } else {
        res.json({
          status: 'success',
        });
      }
    });
  }
);

module.exports = router;
