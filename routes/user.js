const router = require('express').Router();
const {
  getUsers, getUsersById, patchUser, patchUserAvatar, userInfo,
} = require('../contollers/user');

router.get('/users/:userId', getUsersById);
router.get('/users', getUsers);
router.patch('/users/me', patchUser);
router.patch('/users/me/avatar', patchUserAvatar);
router.get('/users/me', userInfo);

module.exports = router;
