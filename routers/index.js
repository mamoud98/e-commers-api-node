const catagoryRouter = require("./catagoryRouter");
const subCatagoryRouter = require("./subCatagoryRouter");
const brandsRouter = require("./brandRouter");
const productsRouter = require("./productRouter");
const usersRouter = require("./userRouter");
const authRouter = require("./authRouter");
const reviewRouter = require("./reviewRouter");
const wishlistRouter = require("./wishlistRouter");
const addressesRouter = require("./addressesRouter");
const couponRouter = require("./couponRouter");
const cartRouter = require("./cartRouter");
const orderRouter = require("./orderRouter");

const mountRoutes = (app) => {
  app.use("/api/v1/catagories", catagoryRouter);
  app.use("/api/v1/subcatagories", subCatagoryRouter);
  app.use("/api/v1/brands", brandsRouter);
  app.use("/api/v1/products", productsRouter);
  app.use("/api/v1/users", usersRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
  app.use("/api/v1/addresses", addressesRouter);
  app.use("/api/v1/coupons", couponRouter);
  app.use("/api/v1/carts", cartRouter);
  app.use("/api/v1/orders", orderRouter);
};

module.exports = mountRoutes;
