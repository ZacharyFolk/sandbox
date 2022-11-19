const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

app.listen('9999', () => {
  console.log('you did it');
});

app.use('/', (req, res) => {
  console.log('this is it');
});
