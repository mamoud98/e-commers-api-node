const JWT = require("jsonwebtoken");

exports.creatToken = (payload) =>
  JWT.sign({ id: payload }, process.env.JWT_KEY, {
    expiresIn: process.env.EXPIRD_TIME,
  });
