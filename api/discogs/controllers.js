const { generateOptions } = require('./util');
const https = require('https');

const getCollection = async function (req, res) {
  const user = req.params.user;
  const folder = req.params.folder;
  !folder ? 0 : folder;
  const options = generateOptions(
    '/users/' +
      user +
      '/collection/folders/' +
      folder +
      '/releases?key=' +
      process.env.DISCO_KEY +
      '&secret=' +
      process.env.DISCO_SECRET
  );

  https
    .get(options, function (apiResponse) {
      apiResponse.pipe(res);
      console.log(res);
    })
    .on('error', (e) => {
      console.log(e);
      res.status(500).send(constants.error_message);
    });
};

module.exports = { getCollection };
