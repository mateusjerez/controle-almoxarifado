const db = require("../models");

const Product = db.product;

exports.updateStock = async (req, res) => {
    try {
        const trans_type = req.body.type;
        const trans_quantity = req.body.quantity;
        let stock_update = 0;

        const product = await Product.findOne({
            where: {
                name:req.body.product
            }
        })

        const stock_now = product.stock;

        if(trans_type == "IN") stock_update = stock_now + trans_quantity;
        if(trans_type == "OUT") stock_update = stock_now - trans_quantity;

        const product_stock = await Product.update(
            { stock: stock_update },
            {
                where: {
                    id: product.id
                }
            },
        )

        return res.status(200).send({
            message: "Estoque atualizado!",
            stock: stock_update
          });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}