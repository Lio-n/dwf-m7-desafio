import { Model, DataTypes } from "sequelize";
import { sequelize } from "./config";

export class Pet extends Model {}

// * Set State: Lost, by default.
Pet.init(
  {
    full_name: DataTypes.STRING,
    pictureUrl: DataTypes.TEXT,
    state: DataTypes.STRING,
    breed: DataTypes.STRING,
    color: DataTypes.STRING,
    sex: DataTypes.STRING,
    date_last_seen: DataTypes.DATE,
    last_location_lat: DataTypes.FLOAT,
    last_location_lng: DataTypes.FLOAT,
    published_by: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "pet",
  }
);
