const {authJwt} = require("../middleware");
const controller = require("../controllers/report.controller");


module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/api/report/standxproduct/:standId",
        [authJwt.verifyToken, authJwt.isModerator],
        controller.standXProduct
    );   

    app.get(
        "/api/report/stockalert",
        [authJwt.verifyToken, authJwt.isModerator],
        controller.getStockAlert
    )

    app.get(
        "/api/report/movement/:day/:type",
        [authJwt.verifyToken, authJwt.isModerator],
        controller.getMoviment
    )

    app.get(
        "/api/report/producttransaction/:productId",
        [authJwt.verifyToken, authJwt.isModerator],
        controller.productTransaction
    )
}