const { authJwt } = require("../middleware");
const controller = require("../controllers/transaction.controller");
const update = require("../controllers/udateStock.controller");



module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/transaction/transaction",
        [authJwt.verifyToken, authJwt.isModerator],
        controller.transaction, update.updateStock
    );
};