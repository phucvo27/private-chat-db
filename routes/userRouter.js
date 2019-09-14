const userRouter = require('express').Router();
const userControllers = require('../controllers/userControllers')

userRouter.get('/:id/list-friend/', userControllers.getFriends)

module.exports = { userRouter };