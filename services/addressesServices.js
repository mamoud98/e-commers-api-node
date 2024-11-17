const asyncHandler = require("express-async-handler");

const User = require("../models/userModle");
const ApiError = require("../utils/apiError");

// @desc get all addresses from  one user
// @route get api/v1/addresses
// @access private/proteted-user
exports.getAllAddressesForUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");
  res.status(200).json({
    length: user.length,
    data: user.addresses,
  });
});

// @desc add product to addresses
// @route POST api/v1/addresses
// @access private/proteted-user
exports.addAddresse = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "addresses added successfuly ",
    data: user.addresses,
  });
});

// @desc add product to addresses
// @route PUT api/v1/addresses/:id
// @access private/proteted-user
exports.UpdateAddresse = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError("address for this user not fount", 404));
  }
  const address = user.addresses.find(
    (address) => address._id.toString() === req.params.id.toString()
  );
  address.alias = req.body.alias;
  address.details = req.body.details;
  address.phone = req.body.phone;
  address.city = req.body.city;
  address.postalcode = req.body.postalcode;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "addresses added successfuly ",
    data: user.addresses,
  });
});

// @desc get the one address
// @route get api/v1/addresses/:id
// @access private/proteted-user
exports.getAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    _id: req.user._id,
  });

  const addresse = user.addresses.find(
    (addresse) => addresse._id.toString() === req.params.id.toString()
  );
  res.status(200).json({
    data: addresse,
  });
});

// @desc remove product to addresses
// @route delete api/v1/addresses/:id
// @access private/proteted-user
exports.deleteAddresse = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.id } },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "product removed successfuly to your addresses",
    data: user.addresses,
  });
});
