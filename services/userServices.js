const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuid4 } = require("uuid");
const bcrypt = require("bcryptjs");

const User = require("../models/userModle");
const Factory = require("./hanlersFactory");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const { creatToken } = require("../utils/creatToken");

//sharp
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `user-${uuid4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(200, 200)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${fileName}`);

    req.body.profileImg = fileName;
  }

  next();
});

exports.uploadProfileImg = uploadSingleImage("profileImg");

// @desc Get list users
// @route GET api/v1/users
// @access private
exports.getUsers = Factory.gettAll(User);

// @desc Get one user
// @route GET api/v1/users/:id
// @access private
exports.getUser = Factory.getOne(User);

// @desc creat user
// @route POST api/v1/users
// @access private
exports.creatUser = Factory.creatOne(User);

// @desc update user
// @route PUT api/v1/users/:id
// @access private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(
      new ApiError(`No User  found update for this item ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: user });
});
// @desc update user password
// @route PUT api/v1/users/changePassword/:id
// @access private
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      ChangedTimeAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(
      new ApiError(`No User  found update for this item ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: user });
});
// @desc delete user
// @route delete api/v1/users/:id
// @access private
exports.deleteUser = Factory.deleteOne(User);

// @desc Get Logged user data
// @route get api/v1/users/getMe
// @access private
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc update logged user password
// @route PUT api/v1/users/updateMyPassword
// @access private
exports.updateMyPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      ChangedTimeAt: Date.now(),
    },
    {
      new: true,
    }
  );
  const token = creatToken(req.user._id);
  res.status(200).json({ data: user, token });
});
// @desc update logged user data
// @route PUT api/v1/users/updateMyData
// @access private
exports.updateMyData = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ data: user });
});

// @desc Deactivet user Data
// @route delete api/v1/users/deleteMe
// @access private
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { active: false },
    {
      new: true,
    }
  );

  res.status(200).json({ state: "Success" });
});
