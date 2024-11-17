const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "User required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    ChangedTimeAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },
    photo: String,
    profileImg: String,
    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "Too short password "],
    },
    role: {
      type: String,
      enum: ["user", "manger", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalcode: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

const setImgeURL = (doc) => {
  if (doc.profileImg) {
    const imageUrl = `${process.env.BASE_URL}/user/${doc.profileImg}`;
    doc.profileImg = imageUrl;
  }
  if (doc.photo) {
    const imageUrl = `${process.env.BASE_URL}/user/${doc.photo}`;
    doc.photo = imageUrl;
  }
};

// For getOne, getMany, Update
UserSchema.post("init", (doc) => {
  setImgeURL(doc);
});

// For create
UserSchema.post("save", (doc) => {
  setImgeURL(doc);
});

module.exports = mongoose.model("User", UserSchema);
