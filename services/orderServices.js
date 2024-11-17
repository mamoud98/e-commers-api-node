const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const Cart = require("../models/cartModel");
const Product = require("../models/productModle");
const Order = require("../models/orderModel");
const Factory = require("./hanlersFactory");
const ApiError = require("../utils/apiError");

// @desc    make the order with cash payment
// @route   POST /api/v1/orders/:cartId
// @access  Private/User

exports.creatCashOrder = asyncHandler(async (req, res, next) => {
  //app setting
  const taxprice = 0;
  const shppingPrice = 0;
  // 1) get cart depent on cart id
  const cart = await Cart.findById(req.params.cartId);

  // 2) get order price depent on cart price "cheak if ther is a coupon or not"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxprice + shppingPrice;

  // 3) creat oreder with deflut type "cash"
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  if (order) {
    // 4) after make the order make dec in the prodcut quentety and inc for prodcut sold
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOption, {});

    // 5) clear cart depent on cart id
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({
    status: "success",
    data: order,
  });
});

//middleware for adding  the objectForFind in to req
exports.addObjectForFindInTOReq = (req, res, next) => {
  if (req.user.role === "user") {
    req.objectForFind = { catagory: req.user._id };
  }
  next();
};

// @desc Get list of orders for one user or for the admain
// @route GET api/v1/orders
// @access privert/user-admin
exports.getorders = Factory.gettAll(Order);

// @desc Get one order
// @route GET api/v1/orders/:id
// @access privert/user
exports.getorder = Factory.getOne(Order);

// @desc update is Paid order
// @route PUT api/v1/orders/:id/isPaid
// @access privert/adimn-manger
exports.OrderIsPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("htier is no order for this id", 404));
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const updateOrder = await order.save();
  res.status(200).json({ status: "success", data: updateOrder });
});
// @desc update is Delivered order
// @route PUT api/v1/orders/:id/isDelivered
// @access privert/adimn-manger
exports.OrderisDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("htier is no order for this id", 404));
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updateOrder = await order.save();
  res.status(200).json({ status: "success", data: updateOrder });
});

// @desc get cheakout secction from strip for payment
// @route GET api/v1/orders/checkout-session/:cartId
// @access privert/user
exports.cheakOutSecction = asyncHandler(async (req, res, next) => {
  //app setting
  const taxprice = 0;
  const shppingPrice = 0;
  // 1) get cart depent on cart id
  const cart = await Cart.findById(req.params.cartId);

  // 2) get order price depent on cart price "cheak if ther is a coupon or not"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxprice + shppingPrice;

  //3) creat stripe cheakout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        name: req.user.name,
        amount: totalOrderPrice * 100,
        currency: "USD",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  //4)sen session to fornt end
  res.status(200).json({ status: "success", session });
});
