const router = require('express').Router();
const {
  getCard, deleteCard, createCard, likeCard, deletelikeCard,
} = require('../contollers/card');
const auth = require('../middlewares/auth');

router.use(auth);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.get('/cards', getCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', deletelikeCard);
module.exports = router;
