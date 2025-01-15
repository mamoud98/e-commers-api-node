const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModle");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const { creatToken, creatRefreshToken } = require("../utils/creatToken");

// @desc make singnUp for new user
// @route POST api/v1/auth/signup
// @access public
exports.signUp = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    password: req.body.password,
    phone: req.body.phone,
    email: req.body.email,
  });

  const token = creatToken(user._id);
  const refreshTokens = creatRefreshToken(user._id);
  res.status(200).json({ data: user, token, refreshTokens });
});

// @desc make new token for the user
// @route POST api/v1/auth/refreshToken
// @access public
exports.refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new ApiError("Refresh Token not valid", 403));
  }

  const decoded = JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  if (!decoded) {
    return next(new ApiError("Refresh Token expired", 403));
  }
  const token = creatToken(decoded.id);
  res.status(200).json({ token });
});

// @desc make sign in for new user
// @route POST api/v1/auth/signin
// @access public
exports.signIn = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ [req.typeData]: req.body.userData });

  if (!user || !(await bcrypt.compare(req.body.password, user?.password))) {
    return next(new ApiError("password or email is incorect", 401));
  }

  const token = creatToken(user._id);
  const refreshTokens = creatRefreshToken(user._id);
  res.status(200).json({ data: user, token, refreshTokens });
});

// @des  this for cheack if the user has token or not
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  //1) check if token exist
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("your are not login", 401));
  }

  //2) Verify token
  const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (!decoded) {
    return next(new ApiError("Invalid Access Token", 401));
  }

  //3) check if the user exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return new ApiError("the user is not exsit", 401);
  }

  //4) check if the user change his password after the token creat
  if (currentUser.ChangedTimeAt) {
    const passCahngeTiemTostam = parseInt(
      currentUser.ChangedTimeAt.getTime() / 1000,
      10
    );
    if (passCahngeTiemTostam > decoded.iat) {
      return next(new ApiError("pleass make login again...", 401));
    }
  }
  req.user = currentUser;
  next();
});

// @des  this for choose who can use the protected route
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("your are not allowed to access this route", 403)
      );
    }
    next();
  });

// @des  this for make reset hash password for the user forgot his password
// @route POST api/v1/auth/forgot
// @access public
exports.ForgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get uer by email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ApiError(`thier is no user for this email ${req.body.email}`, 401)
    );
  }
  // 2) if user exist, Generate reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedREsetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  //save the hashedREsetCode in db
  user.passwordResetCode = hashedREsetCode;
  //Add expiration time for password reset code (10min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // 3) Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    // return next(new ApiError("There is an error in sending email", 500));
    return next(new ApiError(err, 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});
// @des  Verify password reset code
// @route POST api/v1/auth/verifyREsetCode
// @access public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code

  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }

  //2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({ email: user.email, status: "Success" });
});

// @des   reset code password
// @route PUT api/v1/auth/resetPassword
// @access public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user for this email ${req.body.email}`, 404)
    );
  }

  //2) check if reset code verified.
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }
  user.password = req.body.password;
  user.passwordResetVerified = undefined;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  //3) if everythink is ok, generaye token
  const token = creatToken(user._id);
  const refreshTokens = creatRefreshToken(user._id);
  res.status(200).json({ user, token, refreshTokens });
});
