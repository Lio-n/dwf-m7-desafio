import "dotenv/config";
import { sequelize } from "./models/config";
import "./models";

// sequelize
//   .sync({ alter: true })
//   .then((res) => console.log(res))
//   .catch((err) => console.log(`Error: ${err}`));

// podemos usar el force si necesitamos resetear la base por completo
sequelize.sync({ force: true }).then((res) => console.log(res));
