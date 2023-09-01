const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');
const { login, createUser } = require('./contollers/user');
const auth = require('./middlewares/auth');

const notFound = 404;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('connected to db');
});

const app = express();
const port = 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use(router);
app.use((req, res) => {
  res.status(notFound).send({ message: 'Page Not Found' });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
