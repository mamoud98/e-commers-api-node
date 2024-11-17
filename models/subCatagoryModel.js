const mongoose = require("mongoose");

const subCatagorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Catagory required"],
      unique: [true, "Catagory required"],
      minlength: [3, "Too short name"],
      maxlength: [32, "Too long name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    catagory: {
      type: mongoose.Schema.ObjectId,
      ref: "Catagory",
      required: [true, "Catagory required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SubCatagory", subCatagorySchema);
