import "dotenv/config";
import { sequelize } from "./models/config";
import "./models";

sequelize.sync({ force: true }).then((res) => console.log(res));
