const express = require("express");

const authServices = require("../services/authServices");
const {
  addProductToWishlist,
  deleteProductToWishlist,
  getAllWishlistForUser,
} = require("../services/wishlistServices");

const router = express.Router();

router.use(authServices.protect, authServices.allowedTo("user"));

router.route("/").get(getAllWishlistForUser).post(addProductToWishlist);
router.route("/:productId").delete(deleteProductToWishlist);

module.exports = router;
