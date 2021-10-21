const multer = require("multer");
const path = require("path");

function generateFileExt(file) {
  return file.originalname.substring(file.originalname.lastIndexOf("."), file.originalname.length);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, `../uploads`));
  },
  filename: function (req, file, cb) {
    let ext = ".zip";
    if (file.originalname.split(".").length > 1) ext = generateFileExt(file);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
});


module.exports = upload;
