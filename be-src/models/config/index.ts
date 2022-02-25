import { Sequelize } from "sequelize";

const { HEROKU_USERNAME, HEROKU_PASSWORD, HEROKU_DATABASE, HEROKU_HOST } = process.env;

export const sequelize = new Sequelize({
  dialect: "postgres",
  username: HEROKU_USERNAME,
  password: HEROKU_PASSWORD,
  database: HEROKU_DATABASE,
  port: 5432,
  host: HEROKU_HOST,
  ssl: true,
  // * esto es necesario para que corra correctamente
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize.authenticate();
