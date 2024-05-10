const { authJwt } = require("../middleware");
const verify = require("../middleware/verifyProduct");
const controller = require("../controllers/product.controller");



module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/product/productadd",
    [authJwt.verifyToken, authJwt.isModerator, verify.checkDuplicateName],
    controller.productadd
  );

};