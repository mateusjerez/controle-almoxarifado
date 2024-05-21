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
        controller.standXProduct
    );   

    app.get(
        "/api/report/stockalert",
        controller.getStockAlert
    )
}