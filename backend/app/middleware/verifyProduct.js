const db = require("../models");
const Products = db.product;
const verifyToken = require("./authJwt")

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

checkPermission = async (req, res, next) => {
    let isMod = verifyToken.isModerator();
    let hasToken = verifyToken.verifyToken();

    if(!isMod || !hasToken) {
        return res.status(400).send({
            message: "Erro! Usuário não tem permissão para executar esta ação!"
        });
    }

    next();
}

const verifyProduct = { checkDuplicateName };

module.exports = verifyProduct;