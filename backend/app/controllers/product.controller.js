const db = require("../models");
const Product = db.product;
const Stand = db.stand;
const Unit = db.unit;
const ProductUnit = db.productUnit

const Op = db.Sequelize.Op;


exports.productadd = async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
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

      if (result_stand && result_unit) res.send({ message: "Produto cadastrado com sucesso!" });
    }

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.productlist = async (req, res) => {
  try {
    const productConsult = await Product.findAll();
    let productList = [];

    for (let i = 0; i < productConsult.length; i++) {
      productList.push(
        {
          productname: productConsult[i].name,
          productStock: productConsult[i].stock
        })
    }


    return res.status(200).send({
      productList
    });


  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}