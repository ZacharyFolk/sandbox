const router = require('express').Router();
const { readSync } = require('fs');
const multer = require('multer');
const path = require('path');

const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: 'images',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 3000000, // 3 MB
  },
  fileFilter(req, file, cb) {
    // filter just images
    if (!file.originalname.match(/\.(png|jpg|jpeg|gif)$/)) {
      return cb(new Error('Please upload a Image'));
    }
    cb(undefined, true);
  },
});

// For Single image upload
router.post(
  '/image',
  imageUpload.single('file'),
  (req, res) => {
    res.status(200).send({ location: req.file.path });
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// For multiple image upload

router.post(
  '/multipleImages',
  imageUpload.array('images', 4),
  (req, res) => {
    res.send(req.files);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

const videoStorage = multer.diskStorage({
  destination: 'videos', // Destination to store video
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    );
  },
});

const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 10000000, // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    // upload only mp4 and mkv format
    if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
      return cb(new Error('Please upload a video'));
    }
    cb(undefined, true);
  },
});
router.post(
  '/video',
  videoUpload.single('video'),
  (req, res) => {
    res.send(req.file);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
module.exports = router;
