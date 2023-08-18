const router = require("express").Router();
const {getUsers, getUsersById, createUser, patchUser, patchUserAvatar} = require('../contollers/user')
router.post('/users', createUser)
router.get('/users/:userId', getUsersById)
router.get('/users', getUsers)
router.patch('/users/me', patchUser)
router.patch('/users/me/avatar', patchUserAvatar)

module.exports = router;