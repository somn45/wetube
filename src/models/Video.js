import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  hashtags: [{ type: String, required: true }],
  videoUrl: { type: String },
  meta: {
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
});

const Video = mongoose.model('videos', videoSchema);

export default Video;
