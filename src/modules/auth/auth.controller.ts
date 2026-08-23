import {Request, Response} from 'express'
import { registerUser, loginUser, refreshAccessToken} from './auth.service.js'
import { asyncHandler } from '../../utils/asyncHandler.js'


export const register = asyncHandler(async (req: Request, res: Response) => {
    const result = await registerUser(req.body);
    res.status(201).json({
        success: true,
        message: "User registered successfully", 
        data: result,
    })
})

export const login = asyncHandler(async (req : Request, res: Response) => {
    const result = await loginUser(req.body);
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: result,
    })
})

export const refresh = asyncHandler(async (req: Request, res: Response) => {
    const {refreshToken } = req.body
    const result = await refreshAccessToken(refreshToken)
    res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data : result
    })
})