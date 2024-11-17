const express = require("express");
const {
  creatCatagory,
  getCatagories,
  getCatagory,
  updateCatagory,
  deleteCatagory,
  uploadCatagoryImge,
  resizeImage,
} = require("../services/catagoryServices");
const {
  CreatCatagoryValidator,
  getCatagoryValidator,
  updateCatagoryValidator,
  deleteCatagoryValidator,
} = require("../utils/Validator/catagoriesValidators");

const authServices = require("../services/authServices");

const subCatagoryRouter = require("./subCatagoryRouter");

const router = express.Router();

router.use("/:categoryId/subcatagories", subCatagoryRouter);
router
  .route("/")
  .get(getCatagories)
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    uploadCatagoryImge,
    resizeImage,
    CreatCatagoryValidator,
    creatCatagory
  );
router
  .route("/:id")
  .get(getCatagoryValidator, getCatagory)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    uploadCatagoryImge,
    resizeImage,
    updateCatagoryValidator,
    updateCatagory
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteCatagoryValidator,
    deleteCatagory
  );

module.exports = router;
