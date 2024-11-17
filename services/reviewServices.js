const Review = require("../models/reviewModel");
const Factory = require("./hanlersFactory");

//middleware for adding  the objectForFind in to req
exports.addObjectForFindInTOReq = (req, res, next) => {
  if (req.params.productId) {
    req.objectForFind = { product: req.params.productId };
  }
  next();
};

//middleware for adding  the Product Id in to body
exports.addProductIdandUserIdIdInToBody = (req, res, next) => {
  if (req.params.productId) req.body.product = req.params.productId;
  if (req.user._id) req.body.user = req.user._id;
  next();
};

// @desc Get list of reviwes
// @route GET api/v1/reviwes
// @access public
exports.getReviews = Factory.gettAll(Review);

// @desc Get one reviwe
// @route GET api/v1/reviwes/:id
// @access public
exports.getReview = Factory.getOne(Review);

// @desc creat reviwe
// @route POST api/v1/reviwes/:productId
// @access private/proteted
exports.creatReview = Factory.creatOne(Review);

// @desc update reviwe
// @route PUT api/v1/reviwes/:id
// @access private/protected-user
exports.updateReview = Factory.updateOne(Review);

// @desc delete review
// @route delete api/v1/Reviews/:id
// @access private/proteted/user-admin-manger
exports.deleteReview = Factory.deleteOne(Review);
