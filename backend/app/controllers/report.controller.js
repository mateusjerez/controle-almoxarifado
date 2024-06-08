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
                    id: Number(operations[i].productId)
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

        dataReturn.sort(function(a, b) {
            return b.name - a.name;
          }
        );

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



exports.getMoviment = async (req, res) => {
    try {
        let dataReturn = [];
        let dataday = '';
        let dataDate = '';

        switch (req.params.day) {
            case '1':
                dataday = '2024-06-08T04:00:00.000Z';
                dataDate = '07/06/2024';
                break;
            case '2':
                dataday = '2024-06-09T04:00:00.000Z';
                dataDate = '08/06/2024';
                break;
            case '3':
                dataday = '2024-06-10T04:00:00.000Z';
                dataDate = '09/06/2024';
                break;
        }
       
        const transactions = await Transaction.findAll({
            where: {
            type: req.params.type,
            },
            attributes: ['productId', 'quantity', 'createdAt', 'standId']
        });

        for (let i = 0; i < transactions.length; i++) {
            let origin = '';

            const product = await Product.findOne({
                where: {
                    id: transactions[i].productId
                },
                attributes: ['name']
            });

            
            const stand = await Stand.findOne({
                where: {
                    id: transactions[i].standId
                },
                attributes: ['name']
            });
            origin = stand.name;
            

            if(dataReturn.filter(e => e.label === product.name).length > 0) {
                const index = dataReturn.findIndex(e => e.label === product.name);
                dataReturn[index].value += transactions[i].quantity;
                continue;
            }

            dataReturn.push({
                label: product.name,
                value: transactions[i].quantity,
                origin: origin,
                date: dataDate,
            });
        }

        dataReturn.sort(function(a, b) {
            return b.label - a.label;
          }
        );

        return res.status(200).send(dataReturn);
    }catch (error) {
        res.status(500).send({ message: error.message});
    }
}