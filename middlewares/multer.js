import multer, { diskStorage } from 'multer';

const storage = diskStorage({
  filename: function (req,file,cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, //10MB
});
export default upload;