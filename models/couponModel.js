const mongoose = require("mongoose");

const CouponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: [true, "Coupon name require"],
      unique: true,
    },
    expire: {
      type: Date,
      require: [true, "Coupon expire date require"],
    },
    discount: {
      type: Number,
      require: [true, "Coupon discount date require"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", CouponSchema);
