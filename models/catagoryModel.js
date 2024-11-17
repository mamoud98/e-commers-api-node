const mongoose = require("mongoose");

const CatagorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Catagory required"],
      unique: [true, "Catagory required"],
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
    const imageUrl = `${process.env.BASE_URL}/catagories/${doc.image}`;
    doc.image = imageUrl;
  }
};

// For getOne, getMany, Update
CatagorySchema.post("init", (doc) => {
  setImgeURL(doc);
});

// For create
CatagorySchema.post("save", (doc) => {
  setImgeURL(doc);
});

module.exports = mongoose.model("Catagory", CatagorySchema);
