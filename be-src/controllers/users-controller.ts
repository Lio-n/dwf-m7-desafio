import * as crypto from "crypto";
import { User, Auth } from "../models";

// * Hash text.
export const getSHA256ofString = (text: string): string => {
  return crypto.createHash("sha256").update(text).digest("hex");
};

type user = {
  full_name: string;
  password: string;
};

export const existsUser = async (email: string): Promise<boolean> => {
  const exists = await User.findOne({ where: { email } });

  return exists ? true : false;
};

export const createUser = async (userData): Promise<boolean> => {
  const { full_name, password, email } = userData;

  // * User
  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: { full_name, email },
  });

  // * Auth
  await Auth.findOrCreate({
    where: { user_id: user.get("id") },
    defaults: {
      email,
      password: getSHA256ofString(password),
      user_id: user.get("id"),
    },
  });

  return true;
};

export const updateUser = (userId, dataToUpdate: user): boolean => {
  const { full_name, password } = dataToUpdate;

  // * User
  User.findByPk(userId).then((userRes) => {
    userRes.update({ full_name });
  });

  // * Auth
  Auth.findByPk(userId).then((authRes) => {
    authRes.update({ password: getSHA256ofString(password) });
  });

  return true;
};

export const getUserFullname = async (email: string): Promise<any> => {
  const user = await User.findOne({
    attributes: ["full_name"],
    where: { email },
  });

  return user.get("full_name");
};

export const getUserEmail = async (userId: number): Promise<any> => {
  return await User.findByPk(userId).then((resUser) => {
    return resUser.get("email");
  });
};
