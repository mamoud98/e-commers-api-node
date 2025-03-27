const express = require("express");
const {
  signUp,
  signIn,
  ForgotPassword,
  verifyPassResetCode,
  resetPassword,
  refreshToken,
  loginWithGoogle,
} = require("../services/authServices");
const {
  signUpValidator,
  signInValidator,
  resetPasswordValidator,
} = require("../utils/Validator/authValidators");

const router = express.Router();

router.route("/signup").post(signUpValidator, signUp);
router.route("/signin").post(signInValidator, signIn);
router.route("/google").post(loginWithGoogle);
router.route("/forgot").post(ForgotPassword);
router.route("/verifyREsetCode").post(verifyPassResetCode);
router.route("/resetPassword").put(resetPasswordValidator, resetPassword);
router.route("/refreshToken").post(refreshToken);

module.exports = router;
