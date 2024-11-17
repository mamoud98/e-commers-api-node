const express = require("express");
const {
  creatBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  resizeImage,
  uploadBrandImge,
} = require("../services/brandServices");
const {
  CreatBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/Validator/brandsValidators");

const authServices = require("../services/authServices");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    uploadBrandImge,
    resizeImage,
    CreatBrandValidator,
    creatBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    uploadBrandImge,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
