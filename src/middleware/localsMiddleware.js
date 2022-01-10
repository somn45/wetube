import multer from 'multer';

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = req.session.loggedIn;
  res.locals.user = req.session.user;
  next();
};

export const profileUploads = multer({
  dest: 'uploads/profiles',
});

export const videoUploads = multer({
  dest: 'uploads/videos',
});
