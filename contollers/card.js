const cardModel = require('../models/card');
const NotFound = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
const Forbidden = require('../errors/forbidden');

const ok = 200;
const created = 201;

const getCard = (req, res, next) => {
  cardModel.find()
    .then((card) => res.status(ok).send(card))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  return cardModel.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('данной карточки не существует');
      }
      if (userId !== card.owner.toString()) {
        throw new Forbidden('Можно удалять только собственные карточки');
      }
      return cardModel.findByIdAndRemove(cardId)
        .then(() => res.status(ok).send(card));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('некорректные данные'));
      } else {
        next(err);
      }
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardModel.create({ name, link, owner })
    .then((card) => res.status(created).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('некорректные данные'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  return cardModel.findByIdAndUpdate(cardId, { $addToSet: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFound('данной карточки не существует');
      }
      return res.status(ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deletelikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  return cardModel.findByIdAndUpdate(cardId, { $pull: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFound('данной карточки не существует');
      }
      return res.status(ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCard,
  deleteCard,
  createCard,
  likeCard,
  deletelikeCard,
};
