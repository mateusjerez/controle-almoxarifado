const db = require("../models");
const Products = db.product;

checkDuplicateName = async (req, res, next) => {
    try {
        
        let product = await Products.findOne({
            where: {
                name: req.body.name
            }
        });

        if (product) {
            return res.status(400).send({
              message: "Erro! Produto já cadastrado!"
            });
          }

          next();
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
}

const verifyProduct = { checkDuplicateName };

module.exports = verifyProduct;