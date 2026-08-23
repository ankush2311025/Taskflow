import { Request, Response }  from "express";
import { getDatabaseHealth} from '../services/health.service.js';

export async function databaseHealth (
    req: Request,
    res: Response
){
    const result = await getDatabaseHealth();
    res.status(200).json({
        success: true,
        ...result,
    })
}