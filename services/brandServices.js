const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuid4 } = require("uuid");

const Brand = require("../models/brandModel");
const Factory = require("./hanlersFactory");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

//sharp
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuid4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(200, 200)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);

  req.body.image = fileName;

  next();
});

exports.uploadBrandImge = uploadSingleImage("image");

// @desc Get list of Brand
// @route GET api/v1/brands
// @access public
exports.getBrands = Factory.gettAll(Brand);
// @desc Get one Brand
// @route GET api/v1/brand/:id
// @access public
exports.getBrand = Factory.getOne(Brand);

// @desc creat Brand
// @route POST api/v1/brands
// @access private
exports.creatBrand = Factory.creatOne(Brand);

// @desc update Brand
// @route PUT api/v1/brands/:id
// @access private
exports.updateBrand = Factory.updateOne(Brand);

// @desc delete Brand
// @route delete api/v1/brands/:id
// @access private
exports.deleteBrand = Factory.deleteOne(Brand);
