import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { IManager, ICustomer, IAdmin } from "../interfaces";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

export const generateToken = (user: IManager | ICustomer | IAdmin): string => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
