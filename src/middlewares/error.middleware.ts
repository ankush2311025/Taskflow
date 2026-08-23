import { NextFunction, Request, Response } from 'express';
import { AppError} from '../utils/AppError.js';

export function errorMiddleware(
err : AppError,
req: Request,
res: Response,
next: NextFunction
){
    console.log(err)
    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.errors ? {errors: err.errors}: {}),
        });
    }
    return res.status(500).json({
    success: false,
    message: 'Internal Server Error'
})
}

