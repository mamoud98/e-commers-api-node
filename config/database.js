const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose.connect(process.env.DB_URL).then((conn) => {
    console.log(`Database connected on port ${conn.connection.host}`);
  });
};

module.exports = dbConnection;
