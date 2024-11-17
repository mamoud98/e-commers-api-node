const express = require("express");

const authServices = require("../services/authServices");
const {
  addProductToCart,
  GetLoggedUserCart,
  removeSpecificCartItem,
  ClearCartItem,
  updateCartItemQuantity,
  applyCoupon,
} = require("../services/cartServices");

const router = express.Router();

router.use(authServices.protect, authServices.allowedTo("user"));

router
  .route("/")
  .post(addProductToCart)
  .get(GetLoggedUserCart)
  .delete(ClearCartItem);
router.put("/applyCoupon", applyCoupon);
router
  .route("/:itemId")
  .delete(removeSpecificCartItem)
  .put(updateCartItemQuantity);

module.exports = router;
