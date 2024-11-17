const express = require("express");
const {
  getUsers,
  creatUser,
  updateUser,
  resizeImage,
  deleteUser,
  getUser,
  uploadProfileImg,
  updateUserPassword,
  getLoggedUserData,
  updateMyPassword,
  updateMyData,
  deleteLoggedUserData,
} = require("../services/userServices");
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/Validator/userValidator");

const authServices = require("../services/authServices");

const router = express.Router();

router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  updateUserPassword
);

router.use(authServices.protect);

router.get("/getMe", getLoggedUserData, getUser);
router.put("/updateMyPassword", updateMyPassword);
router.put("/updateMyData", updateLoggedUserValidator, updateMyData);
router.delete("/deleteMe", deleteLoggedUserData);

router
  .route("/")
  .get(authServices.allowedTo("admin", "manger"), getUsers)
  .post(
    authServices.allowedTo("admin"),
    uploadProfileImg,
    resizeImage,
    createUserValidator,
    creatUser
  );
router
  .route("/:id")
  .get(authServices.allowedTo("admin"), getUserValidator, getUser)
  .put(
    authServices.allowedTo("admin"),
    uploadProfileImg,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(authServices.allowedTo("admin"), deleteUserValidator, deleteUser);

module.exports = router;
