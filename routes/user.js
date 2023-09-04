const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const router = require('express').Router();
const {
  getUsers, getUsersById, patchUser, patchUserAvatar, userInfo,
} = require('../contollers/user');

router.get('/users/:userId', auth, getUsersById);
router.get('/users', auth, getUsers);
router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), patchUser);
router.patch('/users/me/avatar', auth, patchUserAvatar);
router.get('/users/me', auth, userInfo);

module.exports = router;
