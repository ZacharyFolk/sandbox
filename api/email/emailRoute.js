const router = require('express').Router();
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  host: 'az1-ts9.a2hosting.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', (req, res, next) => {
  console.log('REACHED SEND');
  var name = req.body.name;
  var email = req.body.email;
  var message = req.body.message;
  var content = `name: ${name} \n email: ${email} \n message: ${message} `;
  console.log(content);
  var mail = {
    from: 'zachary@folkphotography.com',
    to: 'zachary@folkphotography.com',
    subject: 'New Message from Contact Form',
    text: content,
  };
  transporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log(process.env.MAIL_USERNAME);

      console.log(process.env.MAIL_PASSWORD);

      console.log(err);
      res.json({
        status: 'fail',
      });
    } else {
      console.log('Suck sess?');
      res.json({
        status: 'success',
      });
    }
  });
});

module.exports = router;
