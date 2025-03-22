import {kdf, verify} from 'scrypt-kdf';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secretly_secret_key';

export const hashPassword = async (password: string): Promise<string> => {
  const hashBuffer = await kdf(Buffer.from(password), {logN: 15})

  return hashBuffer.toString("base64")
};

export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await verify(Buffer.from(hash, "base64"), Buffer.from(password));
};

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const generateExpiry = (duration: number = 15) => {
  return new Date(Date.now() + duration * 60 * 1000) // expires in 15 mins
}