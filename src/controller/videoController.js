import Video from '../models/Video.js';

export const home = async (req, res) => {
  const videos = await Video.find();
  res.render('home', { pageTitle: 'Home', videos });
};

export const watchVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  res.render('watchVideo', { pageTitle: video.title, video });
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
  return res.render('search', { pageTitle: 'Search Video', videos });
};

export const getUploadVideo = (req, res) => {
  res.render('uploadVideo', { pageTitle: 'Upload Video' });
};

export const postUploadVideo = async (req, res) => {
  const { title, description, hashtags } = req.body;
  const video = await Video.create({
    title,
    description,
    hashtags: hashtags.split(',').map((tag) => (tag.startsWith('#') ? tag : `#${tag}`)),
  });
  if (!video) {
    res.status(404).redirect('/videos/upload');
  }
  res.status(200).redirect('/');
};

export const getEditVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  res.render('editVideo', { pageTitle: 'Edit Video', video });
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
