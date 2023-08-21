const cardModel = require('../models/card');

const notFound = 404;
const ok = 200;
const internalServerError = 500;
const badRequest = 400;
const created = 201;

const getCard = (req, res) => {
  cardModel.find()
    .then((card) => res.status(ok).send(card))
    .catch(() => { res.status(internalServerError).send({ message: 'Server Error' }); });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  return cardModel.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res.status(notFound).send({ message: 'invalid data' });
      }
      return res.status(ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'invalid ID' });
      }
      return res.status(internalServerError).send({ message: 'Server Error' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardModel.create({ name, link, owner })
    .then((card) => res.status(created).send(card))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'invalid data' });
      }
      return res.status(internalServerError).send({ message: 'Server Error' });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  return cardModel.findByIdAndUpdate(cardId, { $addToSet: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(notFound).send({ message: 'invalid data' });
      }
      return res.status(ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'invalid ID' });
      }
      return res.status(internalServerError).send({ message: 'Server Error' });
    });
};

const deletelikeCard = (req, res) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  return cardModel.findByIdAndUpdate(cardId, { $pull: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(notFound).send({ message: 'invalid data' });
      }
      return res.status(ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'invalid ID' });
      }
      return res.status(internalServerError).send({ message: 'Server Error' });
    });
};

module.exports = {
  getCard,
  deleteCard,
  createCard,
  likeCard,
  deletelikeCard,
};
