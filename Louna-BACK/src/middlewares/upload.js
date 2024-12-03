import multer from 'multer';
const upload = multer({
  dest: 'uploads/',
  limits: {fileSize: 1024 * 1024 * process.env.MAX_UPLOAD_SIZE},
  fileFilter: (req, file, cb) => {
    // allow only images and videos
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      // accept file
      cb(null, true);
    } else {
      // reject file
      const error = new Error('Only images and videos are allowed!');
      error.status = 400;
      cb(error, false);
    }
  },
});

export {upload};
