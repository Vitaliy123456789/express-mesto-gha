const userModel = require('../models/user');

const getUsers = (req, res) => {
  userModel.find().then((r) => res.status(200).send(r))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return res.status(400).send({ message: 'invalid data' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const getUsersById = (req, res) => {
  const { userId } = req.params;
  return userModel
    .findById(userId)
    .then((r) => {
      if (!r) {
        return res.status(404).send({ message: 'invalid data' });
      }
      return res.status(200).send(r);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return res.status(404).send({ message: 'invalid data' });
      }
      if (e.name === 'CastError') {
        return res.status(400).send({ message: 'invalid ID' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return userModel
    .create({ name, about, avatar })
    .then((r) => res.status(201).send(r))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return res.status(400).send({ message: 'invalid data' });
      }
      return res.status(500).send({ message: 'Server Error' });
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
    .then((r) => {
      if (!r) {
        return res.status(404).send({ message: 'invalid ID' });
      }
      return res.status(200).send(r);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return res.status(400).send({ message: 'invalid data' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const patchUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  return userModel
    .findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((r) => {
      if (!r) {
        return res.status(404).send({ message: 'invalid ID' });
      }
      return res.status(200).send(r);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return res.status(400).send({ message: 'invalid data' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

module.exports = {
  getUsers,
  getUsersById,
  createUser,
  patchUser,
  patchUserAvatar,
};
