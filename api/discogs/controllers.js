const getCollection = async function (req, res) {
  const user = req.params.user;
  const folder = req.params.folder;
  !folder ? 0 : folder;
  const url =
    'http://api.discogs.com' +
    '/users/' +
    user +
    '/collection/folders/' +
    folder +
    '/releases?key=' +
    process.env.DISCO_KEY +
    '&secret=' +
    process.env.DISCO_SECRET;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json(err.message);
    });
};

module.exports = { getCollection };
