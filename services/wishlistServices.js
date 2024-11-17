const asyncHandler = require("express-async-handler");

const User = require("../models/userModle");

// @desc get all product from wishlist for one user
// @route get api/v1/wishlist
// @access private/proteted-user
exports.getAllWishlistForUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json({
    length: user.length,
    data: user.wishlist,
  });
});

// @desc add product to wishlist
// @route POST api/v1/wishlist
// @access private/proteted-user
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "product added successfuly to your wishlist",
    data: user,
  });
});
// @desc remove product to wishlist
// @route delete api/v1/wishlist/:productId
// @access private/proteted-user
exports.deleteProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "product removed successfuly to your wishlist",
    data: user.wishlist,
  });
});
