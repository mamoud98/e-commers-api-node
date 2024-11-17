const { check } = require("express-validator");
const slugify = require("slugify");

const validator = require("../../middleware/validatorMiddleware");

exports.getSubCatagoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcatagory id"),
  validator,
];

exports.CreatSubCatagoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory required")
    .isLength({ min: 3 })
    .withMessage("Too short subCategory name")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("catagory")
    .notEmpty()
    .withMessage("subCatagory must be blong to Catagory")
    .isMongoId()
    .withMessage("Invalid catagory Id"),
  validator,
];

exports.updateSubCatagoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcatagory id"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator,
];

exports.deleteSubCatagoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcatagory id"),
  validator,
];
