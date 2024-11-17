const Factory = require("./hanlersFactory");
const Coupon = require("../models/couponModel");

// @desc Get list of Coupon
// @route GET api/v1/coupons
// @access private/admain-manger
exports.getCoupons = Factory.gettAll(Coupon);
// @desc Get one Coupon
// @route GET api/v1/coupon/:id
// @access private/admain-manger
exports.getCoupon = Factory.getOne(Coupon);

// @desc creat Coupon
// @route POST api/v1/coupons
// @access private/admain-manger
exports.creatCoupon = Factory.creatOne(Coupon);

// @desc update Coupon
// @route PUT api/v1/coupons/:id
// @access private/admain-manger
exports.updateCoupon = Factory.updateOne(Coupon);

// @desc delete Coupon
// @route delete api/v1/coupons/:id
// @access private/admain-manger
exports.deleteCoupon = Factory.deleteOne(Coupon);
