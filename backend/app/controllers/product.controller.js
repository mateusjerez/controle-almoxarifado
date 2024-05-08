const db = require("../models");
const Product = db.product;
const Stand = db.stand;
const Unit = db.unit;

const Op = db.Sequelize.Op;


exports.productin = async (req, res) => {
    try {
        const product = await Product.create({
            name: req.body.name,
            owner: req.body.owner
        })

        if (req.body.stands && req.body.unit) {
            const stands = await Stand.findAll({
              where: {
                name: {
                  [Op.or]: req.body.stands,
                },
              },
            });

            const result_stand = product.setStands(stands);

            const units = await Unit.findAll({
                where: {
                  name: req.body.unit,
                  },
                }
              );
            
            const result_unit = product.setUnits(units);
            
            if (result_stand && result_unit) res.send({ message: "Produto cadastrado com sucesso!"});

        }

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}