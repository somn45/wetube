import express from 'express';
import { home, searchVideo } from '../controller/videoController.js';
import { join, login } from '../controller/userController.js';

const rootRouter = express.Router();

rootRouter.get('/', home);
rootRouter.get('/join', join);
rootRouter.get('/login', login);
rootRouter.get('/search', searchVideo);

export default rootRouter;
