import Video from '../models/Video.js';
import User from '../models/User.js';

export const home = async (req, res) => {
  const videos = await Video.find();
  res.render('videoPug/home', { pageTitle: 'Home', videos });
};

export const watchVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate('owner');
  res.render('videoPug/watchVideo', { pageTitle: video.title, video });
};

export const searchVideo = async (req, res) => {
  const { title } = req.query;
  let videos = [];
  if (title) {
    const filteredVideos = await Video.find({
      title: {
        $regex: new RegExp(title, 'i'),
      },
    });
    videos = filteredVideos;
  }
  return res.render('videoPug/search', { pageTitle: 'Search Video', videos });
};

export const getUploadVideo = (req, res) => {
  res.render('videoPug/uploadVideo', { pageTitle: 'Upload Video' });
};

export const postUploadVideo = async (req, res) => {
  const { title, description, hashtags } = req.body;
  const { file } = req;
  const user = req.session.user;
  const video = await Video.create({
    title,
    description,
    hashtags: hashtags
      .split(',')
      .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`)),
    videoUrl: file ? file.path : '',
    owner: user._id,
  });
  await User.findByIdAndUpdate(user._id, {
    videos: [...user.videos, video._id],
  });
  if (!video) {
    res.status(404).redirect('/videos/upload');
  }
  res.status(200).redirect('/');
};

export const getEditVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  res.render('videoPug/editVideo', { pageTitle: 'Edit Video', video });
};

export const postEditVideo = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags,
  });
  res.redirect(`/videos/${video.id}`);
};
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findByIdAndDelete(id);
  res.redirect('/');
};
