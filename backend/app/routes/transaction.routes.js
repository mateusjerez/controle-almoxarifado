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
        "/api/product/transaction",
        [authJwt.verifyToken, authJwt.isModerator],
        controller.transaction, update.updateStock
    );

    app.get(
        "/api/product/availablelist/:standIdent",
        controller.getAvailableList
    );

    app.get(
        "/api/product/standlist",
        controller.getStandList
    )

    app.get(
        "/api/product/stand/:standIdent",
        controller.getStand
    )
};