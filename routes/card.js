const router = require("express").Router();
const {getCard, deleteCard, createCard, likeCard, DeletelikeCard} = require('../contollers/card')
router.post('/cards', createCard)
router.delete('/cards/:cardId', deleteCard)
router.get('/cards', getCard)
router.put('/cards/:cardId/likes', likeCard)
router.delete('/cards/:cardId/likes', DeletelikeCard)
module.exports = router;