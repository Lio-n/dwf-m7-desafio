import { User } from "./users";
import { Auth } from "./auth";
import { Pet } from "./pets";
import { Report } from "./reports";

User.hasOne(Auth);
Auth.belongsTo(User);

User.hasMany(Pet);
Pet.belongsTo(User);

Pet.hasMany(Report);
Report.belongsTo(Pet);

export { User, Auth, Report, Pet };
