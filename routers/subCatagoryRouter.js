const express = require("express");
const {
  creatSubCatagory,
  getSubCatagories,
  getSubCatagory,
  updateSubCatagory,
  deleteSubCatagory,
  addObjectForFindInTOReq,
  addCatagoryIdInToBody,
} = require("../services/subCatagoryServices");
const {
  CreatSubCatagoryValidator,
  getSubCatagoryValidator,
  updateSubCatagoryValidator,
  deleteSubCatagoryValidator,
} = require("../utils/Validator/subCatagoriesValidators");

const authServices = require("../services/authServices");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    addCatagoryIdInToBody,
    CreatSubCatagoryValidator,
    creatSubCatagory
  )
  .get(addObjectForFindInTOReq, getSubCatagories);
router
  .route("/:id")
  .get(getSubCatagoryValidator, getSubCatagory)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    updateSubCatagoryValidator,
    updateSubCatagory
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteSubCatagoryValidator,
    deleteSubCatagory
  );

module.exports = router;
