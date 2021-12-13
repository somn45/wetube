import express from 'express';
import { home, searchVideo } from '../controller/videoController.js';
import { getJoin, postJoin, getLogin, postLogin, logout } from '../controller/userController.js';

const rootRouter = express.Router();

rootRouter.get('/', home);
rootRouter.route('/join').get(getJoin).post(postJoin);
rootRouter.route('/login').get(getLogin).post(postLogin);
rootRouter.get('/logout', logout);
rootRouter.get('/search', searchVideo);

export default rootRouter;
