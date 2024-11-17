const express = require("express");

const {
  getProducts,
  creatProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImge,
  resizeImage,
} = require("../services/productServices");
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/Validator/productValidator");

const authServices = require("../services/authServices");
const ReviewRouter = require("./reviewRouter");

const router = express.Router();

router.use("/:productId/reviews", ReviewRouter);

router
  .route("/")
  .get(getProducts)
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    uploadProductImge,
    resizeImage,
    createProductValidator,
    creatProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    uploadProductImge,
    resizeImage,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
