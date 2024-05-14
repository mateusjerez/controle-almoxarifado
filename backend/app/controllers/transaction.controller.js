const db = require("../models");

const Product = db.product;
const Stand = db.stand;
const User = db.user;
const Transaction = db.transaction;

exports.transaction = async (req, res, next) => {
    try {
        const trans_type = req.body.type;
        const trans_quantity = req.body.quantity;

        const product = await Product.findOne({
            where: {
                name:req.body.product
            }
        })

        const user = await User.findOne({
            where: {
                username:req.body.user
            }
        })

        const transaction = await Transaction.create({
            type: trans_type,
            quantity: trans_quantity,
            userId: user.id,
            productId: product.id            
        })

        next();

    } catch (error) {
        res.status(500).send({ message: error.message + " Erro ao realizar transação! " + req.body.product + " " + req.body.user + " " + req.body.type + " " + req.body.quantity});
    }
}


