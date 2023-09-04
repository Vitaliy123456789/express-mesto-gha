const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  getUsers, getUsersById, patchUser, patchUserAvatar, userInfo,
} = require('../contollers/user');

router.get('/users/:userId', getUsersById);
router.get('/users', getUsers);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), patchUser);
router.patch('/users/me/avatar', patchUserAvatar);
router.get('/users/me', userInfo);

module.exports = router;
