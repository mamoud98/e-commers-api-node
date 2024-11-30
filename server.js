const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalError = require("./middleware/errorMiddleware");
const { webhookCheckout } = require("./services/orderServices");

dotenv.config({ path: "config.env" });

const mountRoutes = require("./routers");

//connect with db
dbConnection();

//express app
const app = express();

//middleware
app.use(cors());
app.options("*", cors());
app.use(compression());

// Checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

app.use(express.json({ limit: "20kb" }));
// Middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode ${process.env.NODE_ENV}`);
}

// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

//Routers
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`this royuter not exist  ${req.originalUrl}`, 400));
});

//Error handlers for global Error for express errors
app.use(globalError);

const port = process.env.PORT || 8080;

//server
const server = app.listen(port, () => {
  console.log(`App listening on port  ${port}`);
});

//handle error for Rejection error
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error: ${err.name}| ${err.message}`);
  server.close(() => {
    console.error("shit down server ...");
    process.exit(1);
  });
});
