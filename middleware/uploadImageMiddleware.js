const multer = require("multer");

const ApiError = require("../utils/apiError");
const { model } = require("mongoose");

const multerConfig = () => {
  // 1 ) diskStorage
  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads/catagories");
  //   },
  //   filename: function (req, file, cb) {
  //     //catagory-id-Date-fileExtension
  //     const ext = file.mimetype.split("/")[1];
  //     const fileName = `catagory-${uuid4()}-${Date.now()}.${ext}`;
  //     cb(null, fileName);
  //   },
  // });

  // 2) memory Storage
  const multerStorage = multer.memoryStorage();

  const multerFileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only image allowed", 400), false);
    }
  };
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFileFilter,
  });
  return upload;
};
exports.uploadSingleImage = (model) => multerConfig().single(model);

exports.uploadMoreThanOneImage = (arryOfData) =>
  multerConfig().fields(arryOfData);
