const asyncHandler = require("express-async-handler");

const Product = require("../models/productModle");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const ApiError = require("../utils/apiError");

const calcTotalPrice = (cart) => {
  let TotlaPrice = 0;
  cart.cartItems.forEach((item) => {
    TotlaPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = TotlaPrice;
  cart.totalPriceAfterDiscount = undefined;
};

// @desc add item to cart
// @route POST api/v1/carts
// @access protected-user
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const prodcut = await Product.findById(productId);
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    // create new cart
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: prodcut.price }],
    });
  } else {
    const existCartIndex = cart.cartItems.findIndex((item, index) => {
      console.log(item, "1731670990792");
      return item.product.toString() === productId && item.color === color;
    });
    //if the product is exist update the quentaty
    if (existCartIndex > -1) {
      const cartItems = cart.cartItems[existCartIndex];
      cartItems.quantity += 1;
      cart.cartItems[existCartIndex] = cartItems;
    } else {
      //if the prodcut not exist add a new product
      cart.cartItems.push({ product: productId, color, price: prodcut.price });
    }
  }
  // update the Total Price
  calcTotalPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItem: cart.cartItems.length,
    message: "prodct add to cart successfully ",
    data: cart,
  });
});

// @desc get logged user cart
// @route GET api/v1/carts
// @access protected-user
exports.GetLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.find({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Ther is no cart for this user", 404));
  }

  res.status(200).json({
    status: "success",
    numOfCartItem: cart[0].cartItems.length,
    data: cart,
  });
});

// @desc delete item form user cart
// @route DELETE api/v1/carts/:itemId
// @access protected-user
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true }
  );

  // update the Total Price
  calcTotalPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItem: cart.cartItems.length,
    data: cart,
  });
});

// @desc make the user cart empty
// @route DELETE api/v1/carts
// @access protected-user
exports.ClearCartItem = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(200).send();
});

// @desc    Update specific cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(`there is no cart for user ${req.user._id}`, 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`there is no item for this id :${req.params.itemId}`, 404)
    );
  }

  calcTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Apply coupon on logged user cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`));
  }

  // 2) Get logged user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2); // 99.23

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
