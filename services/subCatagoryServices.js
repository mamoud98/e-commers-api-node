const SubCatagory = require("../models/subCatagoryModel");
const Factory = require("./hanlersFactory");

//middleware for adding  the objectForFind in to req
exports.addObjectForFindInTOReq = (req, res, next) => {
  if (req.params.categoryId) {
    req.objectForFind = { catagory: req.params.categoryId };
  }
  next();
};

//middleware for adding  the Catagory Id in to body
exports.addCatagoryIdInToBody = (req, res, next) => {
  if (req.params.categoryId) {
    req.body.catagory = req.params.categoryId;
  }
  next();
};

// Nested router
// @route GET /api/v1/catagories/:categoryId/subcatagories

// @desc Get list of SubCatagory
// @route GET api/v1/subcatagories
// @access public
exports.getSubCatagories = Factory.gettAll(SubCatagory);

// @desc Get one Catagory
// @route GET api/v1/subcatagory/:id
// @access public
exports.getSubCatagory = Factory.getOne(SubCatagory);

// @desc creat SubCatagory
// @route POST api/v1/subcatagories
// @access private
exports.creatSubCatagory = Factory.creatOne(SubCatagory);

// @desc update subCatagory
// @route PUT api/v1/subcatagories/:id
// @access private
exports.updateSubCatagory = Factory.updateOne(SubCatagory);

// @desc delete subCatagory
// @route delete api/v1/subcatagories/:id
// @access private
exports.deleteSubCatagory = Factory.deleteOne(SubCatagory);
