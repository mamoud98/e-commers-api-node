const JWT = require("jsonwebtoken");

exports.creatToken = (payload) =>
  JWT.sign({ id: payload }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
exports.creatRefreshToken = (payload) =>
  JWT.sign({ id: payload }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
