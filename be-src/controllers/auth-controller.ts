import * as jwt from "jsonwebtoken";

// # Models
import { Auth } from "../models";
import { getSHA256ofString } from "./users-controller";

const { TOKEN_KEY } = process.env;

export const authUser = async (authData: { email: string; password: string }): Promise<boolean> => {
  const { email, password } = authData;

  const exists = await Auth.findOne({
    where: { email, password: getSHA256ofString(password) },
  });

  if (exists) {
    // * JWT: Generates token
    const TOKEN = jwt.sign({ id: exists.get("user_id") }, TOKEN_KEY);
    return TOKEN;
  }

  return false;
};
