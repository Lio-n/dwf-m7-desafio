import { Model, DataTypes } from "sequelize";
import { sequelize } from "./config";

export class User extends Model {}

User.init(
  {
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    message: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: "user",
  }
);
