const multer = require("multer");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuid4 } = require("uuid");

const Product = require("../models/productModle");
const Factory = require("./hanlersFactory");
const {
  uploadMoreThanOneImage,
} = require("../middleware/uploadImageMiddleware");

//upload The imges
exports.uploadProductImge = uploadMoreThanOneImage([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

//sharp
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverName = `product-${uuid4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverName}`);

    req.body.imageCover = imageCoverName;
  }
  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageProdcutName = `product-${uuid4()}-${Date.now()}-${
          index + 1
        }.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${imageProdcutName}`);

        req.body.images.push(imageProdcutName);
      })
    );
  }

  next();
});

// @desc Get list of Product
// @route GET api/v1/products
// @access public
exports.getProducts = Factory.gettAll(Product, "Product");

// @desc Get one Product
// @route GET api/v1/products/:id
// @access public
exports.getProduct = Factory.getOne(Product, "review");

// @desc creat Product
// @route POST api/v1/products
// @access private
exports.creatProduct = Factory.creatOne(Product);

// @desc update Product
// @route PUT api/v1/products/:id
// @access private
exports.updateProduct = Factory.updateOne(Product);

// @desc delete Product
// @route delete api/v1/products/:id
// @access private
exports.deleteProduct = Factory.deleteOne(Product);
