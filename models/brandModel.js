const mongoose = require("mongoose");

const BrandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: [true, "Brand required"],
      minlength: [3, "Too short name"],
      maxlength: [32, "Too long name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

const setImgeURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

// For getOne, getMany, Update
BrandSchema.post("init", (doc) => {
  setImgeURL(doc);
});

// For create
BrandSchema.post("save", (doc) => {
  setImgeURL(doc);
});

module.exports = mongoose.model("Brand", BrandSchema);
