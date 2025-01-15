const slugify = require("slugify");
const { check, body } = require("express-validator");

const validator = require("../../middleware/validatorMiddleware");
const User = require("../../models/userModle");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .custom((val) =>
      User.findOne({ phone: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),

  check("phone")
    .notEmpty()
    .withMessage("Phone required")
    .isMobilePhone(["ar-PS"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers")
    .custom((val) =>
      User.findOne({ phone: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),

  validator,
];
exports.signInValidator = [
  check("userData")
    .notEmpty()
    .withMessage("userData required")
    .custom((value, { req }) => {
      // Email validation
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        req.typeData = "email";
        return true;
      }
      // Phone number validation (basic pattern)
      if (/^\+?\d{10,15}$/.test(value)) {
        req.typeData = "phone";
        return true;
      }
      // Name validation (alphabet only)
      if (/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
        req.typeData = "name";
        return true;
      }
      throw new Error("Input must be a valid name, phone number, or email");
    }),
  check("password").notEmpty().withMessage("Password required"),
  validator,
];

// exports.updateUserValidator = [
//   check("id").isMongoId().withMessage("Invalid User id format"),
//   body("name")
//     .optional()
//     .custom((val, { req }) => {
//       req.body.slug = slugify(val);
//       return true;
//     }),
//   check("email")
//     .notEmpty()
//     .withMessage("Email required")
//     .isEmail()
//     .withMessage("Invalid email address")
//     .custom((val) =>
//       User.findOne({ email: val }).then((user) => {
//         if (user) {
//           return Promise.reject(new Error("E-mail already in user"));
//         }
//       })
//     ),
//   check("phone")
//     .optional()
//     .isMobilePhone(["ar-EG", "ar-SA"])
//     .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

//   check("profileImg").optional(),
//   check("role").optional(),
//   validator,
// ];

// exports.changeUserPasswordValidator = [
//   check("id").isMongoId().withMessage("Invalid User id format"),
//   body("currentPassword")
//     .notEmpty()
//     .withMessage("You must enter your current password"),
//   body("passwordConfirm")
//     .notEmpty()
//     .withMessage("You must enter the password confirm"),
//   body("password")
//     .notEmpty()
//     .withMessage("You must enter new password")
//     .custom(async (val, { req }) => {
//       // 1) Verify current password
//       const user = await User.findById(req.params.id);
//       if (!user) {
//         throw new Error("There is no user for this id");
//       }
//       const isCorrectPassword = await bcrypt.compare(
//         req.body.currentPassword,
//         user.password
//       );
//       if (!isCorrectPassword) {
//         throw new Error("Incorrect current password");
//       }

//       // 2) Verify password confirm
//       if (val !== req.body.passwordConfirm) {
//         throw new Error("Password Confirmation incorrect");
//       }
//       return true;
//     }),
//   validator,
// ];

// exports.deleteUserValidator = [
//   check("id").isMongoId().withMessage("Invalid User id format"),
//   validator,
// ];

exports.updateLoggedUserValidator = [
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  validator,
];

exports.resetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),

  validator,
];
