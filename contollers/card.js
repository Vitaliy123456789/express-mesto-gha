const cardModel = require('../models/card');

const getCard = (req, res) => {
  cardModel.find()
    .then((r) => res.status(200).send(r))
    .catch(() => { res.status(500).send({ message: 'Server Error' }); });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  return cardModel.findByIdAndDelete(cardId)
    .then((r) => {
      if (!r) {
        return res.status(404).send({ message: 'invalid data' });
      }
      return res.status(200).send(r);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return res.status(400).send({ message: 'invalid ID' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  cardModel.create({ name, link })
    .then((r) => res.status(201).send(r))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return res.status(400).send({ message: 'invalid data' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  return cardModel.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } })
    .then((r) => {
      if (!r) {
        return res.status(404).send({ message: 'invalid data' });
      }
      return res.status(200).send(r);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return res.status(400).send({ message: 'invalid ID' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const deletelikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  return cardModel.findByIdAndUpdate(cardId, { $pull: { likes: userId } })
    .then((r) => {
      if (!r) {
        return res.status(404).send({ message: 'invalid data' });
      }
      return res.status(200).send(r);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return res.status(400).send({ message: 'invalid ID' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

module.exports = {
  getCard,
  deleteCard,
  createCard,
  likeCard,
  deletelikeCard,
};
