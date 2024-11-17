const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuid4 } = require("uuid");

const Catagory = require("../models/catagoryModel");
const Factory = require("./hanlersFactory");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

//sharp
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `catagory-${uuid4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(200, 200)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/catagories/${fileName}`);

    req.body.image = fileName;
  }

  next();
});

exports.uploadCatagoryImge = uploadSingleImage("image");

// @desc Get list Catagories
// @route GET api/v1/catagories
// @access public
exports.getCatagories = Factory.gettAll(Catagory);

// @desc Get one Catagory
// @route GET api/v1/catagories/:id
// @access public
exports.getCatagory = Factory.getOne(Catagory);

// @desc creat Catagory
// @route POST api/v1/catagories
// @access private/Admin-Manger
exports.creatCatagory = Factory.creatOne(Catagory);

// @desc update Catagory
// @route PUT api/v1/catagories/:id
// @access private/Admin-Manger
exports.updateCatagory = Factory.updateOne(Catagory);

// @desc delete Catagory
// @route delete api/v1/catagories/:id
// @access private/Admin
exports.deleteCatagory = Factory.deleteOne(Catagory);
