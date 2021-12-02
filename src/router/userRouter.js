import express from 'express';
import { editUser, deleteUser } from '../controller/userController.js';
const userRouter = express.Router();

userRouter.get('/:id([0-9]+)/edit', editUser);
userRouter.get('/:id([0-9]+)/delete', deleteUser);

export default userRouter;
