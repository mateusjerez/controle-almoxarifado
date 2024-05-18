const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "controller-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true,
    sameSite: 'strict'
  })
);

// database
const db = require("./app/models");
const Role = db.role;
const Unit = db.unit;
const Stand = db.stand;

db.sequelize.sync();
//force: true will drop the table if it already exists
//  db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
//   });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Bem-vindo ao Sistema de Controle de Estoque!" });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/transaction.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });

  Unit.create({
    id: 1,
    name: "quilo",
    uom: "Kg",
  })

  Unit.create({
    id: 2,
    name: "litro",
    uom: "L",
  })

  Unit.create({
    id: 3,
    name: "pacote",
    uom: "Pc",
  })

  Unit.create({
    id: 4,
    name: "unidade",
    uom: "Un",
  })
  
  Unit.create({
    id: 5,
    name: "caixa",
    uom: "Cx",
  })

  Stand.create({
    id: 1,
    name: "CALDO",
    identity: "202406CA01-05151039",
  })

  Stand.create({
    id: 2,
    name: "DOCES",
    identity: "202406DO01-05151040"
  })

  Stand.create({
    id: 3,
    name: "ESPETINHO",
    identity: "202406ES01-05151039"
  })

}
