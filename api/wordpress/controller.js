const https = require('https');
const xml2js = require('xml2js');

const { generateOptions } = require('./util');

const getPosts = async function (req, res) {
  const options = generateOptions('/feed/');
  https
    .get(options, (rssResponse) => {
      let data = '';
      rssResponse.on('data', (chunk) => {
        data += chunk;
      });
      rssResponse.on('end', () => {
        //  console.log(data);

        xml2js.parseString(data, (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send('Error Occured');
          } else {
            console.log(result);
            res.send(result);
          }
        });
      });
    })
    .on('error', (e) => {
      console.log(e);
      res.status(500).send('Error Occured');
    });
};
module.exports = { getPosts };
