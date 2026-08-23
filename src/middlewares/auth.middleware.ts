import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {AppError} from '../utils/AppError.js';
import dotenv, { configDotenv } from "dotenv"

dotenv.config()

const accessSecret = process.env.JWT_ACCESS_SECRET as string;

if (!accessSecret){
    throw new AppError("JWT_ACCESS_SECRET is not configured");
}

export const authenticate = (
    req: Request,
    res: Response, 
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")){
        throw new AppError("Authentication required", 401)
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, accessSecret);

        if (typeof payload !== "object" || !payload.userId){
            throw new AppError("Invalid access token", 401)
        }
        req.userId = payload.userId as string
        next()
    }catch{
        throw new AppError("Invalid or expired access token", 401)
    }
}