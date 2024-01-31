const constants = require('./constants');

const generateOptions = (_path) => {
  return (options = {
    hostname: constants.hostname,
    path: _path,
    headers: {
      'User-Agent': constants.user_agent,
    },
  });
};

module.exports = { generateOptions };
