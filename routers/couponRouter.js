const express = require("express");

const authServices = require("../services/authServices");
const {
  getCoupons,
  creatCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponServices");

const router = express.Router();

router.use(authServices.protect, authServices.allowedTo("admin", "manger"));

router.route("/").get(getCoupons).post(creatCoupon);
router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
