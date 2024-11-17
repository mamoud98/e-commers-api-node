const express = require("express");

const authServices = require("../services/authServices");
const {
  creatCashOrder,
  getorders,
  getorder,
  addObjectForFindInTOReq,
  OrderIsPaid,
  OrderisDelivered,
  cheakOutSecction,
} = require("../services/orderServices");

const router = express.Router();

router.use(authServices.protect);

router
  .route("/")
  .get(
    authServices.allowedTo("user", "admin"),
    addObjectForFindInTOReq,
    getorders
  );
router.route("/:id").get(authServices.allowedTo("user"), getorder);
router.get(
  "/checkout-session/:cartId",
  authServices.allowedTo("user"),
  cheakOutSecction
);
router.route("/:cartId").post(authServices.allowedTo("user"), creatCashOrder);
router
  .route("/:id/OrderIsPaid")
  .post(authServices.allowedTo("admin", "manger"), OrderIsPaid);
router
  .route("/:id/isDelivered")
  .post(authServices.allowedTo("admin", "manger"), OrderisDelivered);

module.exports = router;
