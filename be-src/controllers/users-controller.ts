import * as crypto from "crypto";
import { User, Auth } from "../models";

// * Hash text.
export const getSHA256ofString = (text: string): string => {
  return crypto.createHash("sha256").update(text).digest("hex");
};

type user = {
  full_name: string;
  password: string;
  email: string;
};

export const existsUser = async (email: string): Promise<boolean> => {
  const exists = await User.findOne({ where: { email } });

  return exists ? true : false;
};

export const createUser = async (userData): Promise<{ id?: any; isCreated: boolean }> => {
  const { full_name, password, email } = userData;

  // * User
  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: { full_name, email },
  });

  if (created) {
    // * Auth
    Auth.findOrCreate({
      where: { user_id: user.get("id") },
      defaults: {
        email,
        password: getSHA256ofString(password),
        user_id: user.get("id"),
      },
    });
    return { isCreated: true };
  }

  return { id: user.get("id"), isCreated: false };
};

export const updateProfile = async (userId, updateData: user): Promise<boolean> => {
  const { full_name, password } = updateData;

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

export const getUserFullname = async (email: string): Promise<string> => {
  const user = (await User.findOne({ where: { email } })) as any;
  return user.full_name;
};
