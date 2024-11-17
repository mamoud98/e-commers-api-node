const express = require("express");

const {
  getReviews,
  creatReview,
  getReview,
  updateReview,
  deleteReview,
  addObjectForFindInTOReq,
  addProductIdandUserIdIdInToBody,
} = require("../services/reviewServices");
const authServices = require("../services/authServices");
const {
  getReviewValidator,
  createReviewValidator,
  deleteReviewValidator,
  updateReviewValidator,
} = require("../utils/Validator/reviewValidator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(addObjectForFindInTOReq, getReviews)
  .post(
    authServices.protect,
    authServices.allowedTo("user"),
    addProductIdandUserIdIdInToBody,
    createReviewValidator,
    creatReview
  );
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    authServices.protect,
    authServices.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("user", "admin", "manger"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
