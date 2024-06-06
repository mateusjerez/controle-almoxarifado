const db = require("../models");
const config = require("../config/auth.config");

const Stand = db.stand;
const Product = db.product;
const Transaction = db.transaction;

const Op = db.Sequelize.Op;

exports.standXProduct = async (req, res) => {
    try {
        const standId = req.params.standId;

        const operations = await Transaction.findAll({
            where: {
                standId: standId,
            },
            attributes: ['type', 'productId', 'quantity']
        });

        let dataReturn = [];

        for (let i = 0; i < operations.length; i++) {
            const product = await Product.findOne({
                where: {
                    id: operations[i].productId
                },
                attributes: ['name']
            });

            if (dataReturn.filter(e => e.label === product.name).length > 0) {
                const index = dataReturn.findIndex(e => e.label === product.name);
                operations[i].type === 'OUT' ? dataReturn[index].y += operations[i].quantity : dataReturn[index].y -= operations[i].quantity;
                continue;
            } else {
                dataReturn.push({
                    label: product.name,
                    y: operations[i].quantity,
                    indexLabel: "{y}",
                });
            }
        }

        return res.status(200).send(dataReturn);


    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.getStockAlert = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                stock: {
                    [Op.lt]: 10
                }
            },
            order: [
                ['name', 'ASC']
              ],
            attributes: ['name', 'stock']
        });

        return res.status(200).send(products);

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}