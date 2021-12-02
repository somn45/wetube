import express from 'express';
import { uploadVideo, watchVideo, editVideo, deleteVideo } from '../controller/videoController.js';

const videoRouter = express.Router();

videoRouter.get('/upload', uploadVideo);
videoRouter.get('/:id([0-9]+)', watchVideo);
videoRouter.get('/:id([0-9]+)/edit', editVideo);
videoRouter.get('/:id([0-9]+)/delete', deleteVideo);
export default videoRouter;
