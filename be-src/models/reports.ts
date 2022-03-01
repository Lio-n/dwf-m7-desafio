import { Model, DataTypes } from "sequelize";
import { sequelize } from "./config";

export class Report extends Model {}

Report.init(
  {
    full_name: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    message: DataTypes.TEXT,
    reported_pet: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "report",
  }
);
