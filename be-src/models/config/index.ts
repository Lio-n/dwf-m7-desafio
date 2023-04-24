import { Sequelize } from "sequelize";

const { DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_HOST, DB_DIALECT, DB_PORT } = process.env;

export const sequelize = new Sequelize({
  username: DB_USERNAME as any,
  password: DB_PASSWORD as any,
  database: DB_DATABASE as any,
  host: DB_HOST as any,
  dialect: DB_DIALECT as any,
  port: +DB_PORT as any,
});

sequelize.authenticate();
