const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const notFound = 404;
const ok = 200;
const internalServerError = 500;
const badRequest = 400;
const created = 201;

const getUsers = (req, res) => {
  userModel.find().then((user) => res.status(ok).send(user))
    .catch(() => {
      res.status(internalServerError).send({ message: 'Server Error' });
    });
};

const getUsersById = (req, res) => {
  const { userId } = req.params;
  return userModel
    .findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(notFound).send({ message: 'invalid data' });
      }
      return res.status(ok).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'invalid ID' });
      }
      return res.status(internalServerError).send({ message: 'Server Error' });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!password) {
    res.status(400).send({ message: 'invalid data' });
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => userModel.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.status(created).send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'invalid data' });
      } if (err.name === 'MongoError' || err.code === 11000) {
        return res.status(409).send({ message: 'Указанный email уже занят' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const patchUser = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  return userModel
    .findByIdAndUpdate(
      owner,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        return res.status(notFound).send({ message: 'invalid ID' });
      }
      return res.status(ok).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'invalid data' });
      }
      return res.status(internalServerError).send({ message: 'Server Error' });
    });
};

const patchUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  return userModel
    .findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(notFound).send({ message: 'invalid ID' });
      }
      return res.status(ok).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'invalid data' });
      }
      return res.status(internalServerError).send({ message: 'Server Error' });
    });
};
const login = (req, res) => {
  const { email, password } = req.body;
  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
const userInfo = (req, res) => {
  userModel.findById(req.user._id)
    .then((user) => res.status(ok).send({
      ID: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'invalid data' });
      }
      return res.status(internalServerError).send({ message: 'Server Error' });
    });
};

module.exports = {
  getUsers,
  getUsersById,
  createUser,
  patchUser,
  patchUserAvatar,
  login,
  userInfo,
};
