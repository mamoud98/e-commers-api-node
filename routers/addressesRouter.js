const express = require("express");

const authServices = require("../services/authServices");
const {
  getAllAddressesForUser,
  addAddresse,
  deleteAddresse,
  getAddress,
  UpdateAddresse,
} = require("../services/addressesServices");

const router = express.Router();

router.use(authServices.protect, authServices.allowedTo("user"));

router.route("/").get(getAllAddressesForUser).post(addAddresse);
router.route("/:id").get(getAddress).put(UpdateAddresse).delete(deleteAddresse);

module.exports = router;
