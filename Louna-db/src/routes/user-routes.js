import express from 'express';
import {
  getUsers,
  getUserById,
  putUser,
  DeleteUser,
} from '../controllers/user-controller.js';

import {authenticateToken} from '../middlewares/authentication.js';

const userRouter = express.Router();

userRouter.route('/').get(getUsers);
userRouter
  .route('/:id')
  .get(getUserById)
  .put(authenticateToken, putUser)
  .delete(authenticateToken, DeleteUser);

export {userRouter};
