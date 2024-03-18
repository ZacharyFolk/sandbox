const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postsRoute = require('./routes/posts');
const categoryRoute = require('./routes/categories');

const cors = require('cors');
const path = require('path');
// const middlewares = require('./github/middlewares');
// const githubRoute = require('./github/githubRoutes');
// const emailRoute = require('./email/emailRoute');
const uploadRoute = require('./routes/upload');
dotenv.config();
console.log(process.env.MONGO_URL);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'images');
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name);
//   },
// });
// const upload = multer({ storage: storage });
// TODO : Restrict cors to specific origin
app.use(cors());
// app.post('/api/upload', upload.single('file'), (req, res) => {
//   res.status(200).json('File has been uploaded');
//   console.log('file uploaded');
// });
app.use(express.json());
app.use('/api/upload/', uploadRoute);
// app.use(middlewares.setHeaders);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postsRoute);
app.use('/api/categories', categoryRoute);
// app.use('/api/github_api', githubRoute);

// app.use('/api/email', emailRoute);
app.use('/images', express.static(path.join(__dirname, '/images')));
app.listen('9999', () => {
  console.log('Starting API server at localhost:9999');
});

app.use('/', (req, res) => {
  console.log('Root page of API');
});
