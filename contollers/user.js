const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const NotFound = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
const Conflict = require('../errors/conflict');
const Unauthorized = require('../errors/Unauthorize');

const ok = 200;
const created = 201;

const getUsers = (req, res, next) => {
  userModel.find().then((user) => res.status(ok).send(user))
    .catch(next);
};

const getUsersById = (req, res, next) => {
  const { userId } = req.params;
  return userModel
    .findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('пользователь не существует');
      }
      return res.status(ok).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Передан некорректный _id пользователя.'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
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
        next(new BadRequest('некорректные данные'));
      } else if (err.code === 11000) {
        next(new Conflict('email уже зарегестрирован'));
      } else {
        next(err);
      }
    });
};

const patchUser = (req, res, next) => {
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
        throw new NotFound('пользователь не существует');
      }
      return res.status(ok).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('некорректные данные'));
      } else {
        next(err);
      }
    });
};

const patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  return userModel
    .findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('пользователь не существует');
      }
      return res.status(ok).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('некорректные данные'));
      } else {
        next(err);
      }
    });
};
const login = (req, res, next) => {
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
    .catch(() => {
      next(new Unauthorized('Необходима авторизация.'));
    });
};
const userInfo = (req, res, next) => {
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
        next(new BadRequest('некорректные данные'));
      } else {
        next(err);
      }
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
