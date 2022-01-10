import express from 'express';
import {
  getUploadVideo,
  postUploadVideo,
  watchVideo,
  getEditVideo,
  postEditVideo,
  deleteVideo,
} from '../controller/videoController.js';
import { videoUploads } from '../middleware/localsMiddleware';

const videoRouter = express.Router();

videoRouter
  .route('/upload')
  .get(getUploadVideo)
  .post(videoUploads.single('video'), postUploadVideo);
videoRouter.get('/:id([0-9a-z]{24})', watchVideo);
videoRouter.route('/:id([0-9a-z]{24})/edit').get(getEditVideo).post(postEditVideo);
videoRouter.get('/:id([0-9a-z]{24})/delete', deleteVideo);
export default videoRouter;
