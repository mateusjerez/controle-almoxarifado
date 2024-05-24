const db = require("../models");

const Product = db.product;
const User = db.user;
const Transaction = db.transaction;
const Stand = db.stand;
const Available = db.available;

exports.transaction = async (req, res, next) => {
    try {
        const trans_type = req.body.type;
        const trans_quantity = req.body.quantity;

        const user = await User.findOne({
            where: {
                username: req.body.user
            }
        })

        if (trans_type === "OUT") {
            
            const transaction = await Transaction.create({
                type: trans_type,
                quantity: trans_quantity,
                userId: user.id,
                productId: req.body.product,
                standId: req.body.stand
            });

        } else {
            const transaction = await Transaction.create({
                type: trans_type,
                quantity: trans_quantity,
                userId: user.id,
                productId: req.body.product,
            });
        };


        next();

    } catch (error) {
        res.status(500).send({ message: error.message + " Erro ao realizar transação! " + req.body.product + " " + req.body.user + " " + req.body.type + " " + req.body.quantity });
    }
}

exports.getAvailableList = async (req, res) => {
    try {
        let availableList = [];

        const stand = await Stand.findOne(
            {
                where: {
                    identity: req.params.standIdent
                }
            }
        );
        
        const productAvailable = await Available.findAll(
            {
                where: {
                    standId: stand.id
                },
            }
        );

        for (let i = 0; i < productAvailable.length; i++) {
            const product = await Product.findOne(
                {
                    where: {
                        id: productAvailable[i].productId
                    }
                }
            );

            availableList.push(product);
        }


        return res.status(200).send({
            availableList
        });


    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.getStandList = async (req, res) => {
    try {
        const standList = await Stand.findAll({
            order: [
                ['name', 'ASC']
              ]
        });

        return res.status(200).send({
            standList
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.getStand = async (req, res) => {
    try {
        const stand = await Stand.findOne(
            {
                where: {
                    identity: req.params.standIdent
                }
            }
        );

        return res.status(200).send({
            stand
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}