const express = require("express");
const {
  signUp,
  signIn,
  ForgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authServices");
const {
  signUpValidator,
  signInValidator,
} = require("../utils/Validator/authValidators");

const router = express.Router();

router.route("/signup").post(signUpValidator, signUp);
router.route("/signin").post(signInValidator, signIn);
//later
router.route("/forgot").post(ForgotPassword);
router.route("/verifyREsetCode").post(verifyPassResetCode);
router.route("/resetPassword").put(resetPassword);

module.exports = router;
