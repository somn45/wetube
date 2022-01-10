import express from 'express';
import {
  getEditUser,
  postEditUser,
  getTrueLeave,
  postTrueLeave,
  getChangePwd,
  postChangePwd,
  startGithubLogin,
  finishGithubLogin,
} from '../controller/userController.js';

const userRouter = express.Router();

userRouter.route('/:id([0-9a-z]{24})/edit').get(getEditUser).post(postEditUser);
userRouter.route('/:id([0-9a-z]{24})/trueLeave').get(getTrueLeave).post(postTrueLeave);
userRouter.route('/:id([0-9a-z]{24})/change-password').get(getChangePwd).post(postChangePwd);
userRouter.get('/github/start', startGithubLogin);
userRouter.get('/github/finish', finishGithubLogin);

export default userRouter;
