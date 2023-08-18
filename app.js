const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('connected to db');
});

const app = express();
const port = 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '64db9ab7a80d6b490b495ac6',
  };

  next();
});

app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
