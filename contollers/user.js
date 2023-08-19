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
  const { name, about, avatar } = req.body;
  return userModel
    .create({ name, about, avatar })
    .then((user) => res.status(created).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'invalid data' });
      }
      return res.status(internalServerError).send({ message: 'Server Error' });
    });
};

const patchUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  return userModel
    .findByIdAndUpdate(
      userId,
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
  const userId = req.user._id;
  return userModel
    .findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
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

module.exports = {
  getUsers,
  getUsersById,
  createUser,
  patchUser,
  patchUserAvatar,
};
