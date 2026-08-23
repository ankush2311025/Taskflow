import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const accessSecret = process.env.JWT_ACCESS_SECRET as string;
const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

if (!accessSecret) {
  throw new Error("JWT_ACCESS_SECRET is not configured");
}

if (!refreshSecret) {
  throw new Error("JWT_REFRESH_SECRET is not configured");
}

export function generateAccessToken(userId: string) {
  return jwt.sign(
    { userId },
    accessSecret,
    { expiresIn: "15m" }
  );
}

export function generateRefreshToken(userId: string) {
  return jwt.sign(
    { userId },
    refreshSecret,
    { expiresIn: "7d" }
  );
}

export function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}