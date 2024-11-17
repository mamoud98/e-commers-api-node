const { check } = require("express-validator");
const slugify = require("slugify");
const validator = require("../../middleware/validatorMiddleware");

exports.getCatagoryValidator = [
  check("id").isMongoId().withMessage("Invalid catagory id"),
  validator,
];

exports.CreatCatagoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator,
];
exports.updateCatagoryValidator = [
  check("id").isMongoId().withMessage("Invalid catagory id"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator,
];
exports.deleteCatagoryValidator = [
  check("id").isMongoId().withMessage("Invalid catagory id"),
  validator,
];
