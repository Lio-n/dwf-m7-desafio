import { Model, DataTypes } from "sequelize";
import { sequelize } from "./config";

export class Report extends Model {}

Report.init(
  {
    reported_by: DataTypes.STRING,
    phone_number: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    reported_pet: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "report",
  }
);
