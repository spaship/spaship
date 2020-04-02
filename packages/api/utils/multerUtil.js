const multer = require("multer");
const config = require("../config");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.get("upload_dir"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
