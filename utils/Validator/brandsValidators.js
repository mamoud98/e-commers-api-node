const { check } = require("express-validator");
const slugify = require("slugify");

const validator = require("../../middleware/validatorMiddleware");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id"),
  validator,
];

exports.CreatBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand required")
    .isLength({ min: 3 })
    .withMessage("Too short Brand name")
    .isLength({ max: 32 })
    .withMessage("Too long Brand name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator,
];
exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator,
];
exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id"),
  validator,
];
