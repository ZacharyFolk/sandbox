const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/users/:user/:folder', controllers.getCollection);

module.exports = router;
