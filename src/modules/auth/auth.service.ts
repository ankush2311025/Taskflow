import bcrypt from 'bcrypt';
import { createRegistration, findUserByEmail, createRefreshToken } from './auth.repository.js';
import { AppError } from '../../utils/AppError.js';
import { generateAccessToken, generateRefreshToken, hashToken } from '../../utils/jwt.js'
import prisma from "../../config/prisma.js";




export async function 
    registerUser(data: {
        name: string;
        email: string;
        password: string;
        organizationName: string;
    }){
        const existingUser = await findUserByEmail(data.email);
        if (existingUser){
            throw new AppError("Email already exists", 409);
        }
    

    const passwordHash = await bcrypt.hash(data.password, 12);

    const result = await createRegistration ({
        name: data.name,
        email: data.email,
        passwordHash,
        organizationName: data.organizationName,
    })

    return {
        user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
        },
        organization: {
            id: result.organization.id,
            name: result.organization.name,
        }
    }
    }

    export async function loginUser(data : {
    email: string;
    password: string;
}){
    const user = await findUserByEmail(data.email);
    if (!user){
        throw new AppError("Invalid email or password", 401);
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid){
        throw new AppError("Invalid email or password", 401);
    }
   const accessToken = generateAccessToken(user.id);
   const refreshToken = generateRefreshToken(user.id);
   const tokenHash = hashToken(refreshToken);

   const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

    await createRefreshToken({
    userId: user.id,
    tokenHash,
    expiresAt,
    })
    console.log("Refresh token saved");

    return {
        user: {
            id : user.id,
            name: user.name,
            email: user.email,
        },
        accessToken,
        refreshToken,
    }

}

export async function findRefreshToken(tokenHash : string) {
    return prisma.refreshToken.findUnique({
        where : {
            tokenHash,
        }
    })
}

export async function revokeRefreshToken(id:string){
    return prisma.refreshToken.update({
        where : {
            id,
        },
        data:{
            revokedAt: new Date(),
        }
    })
}

export async function refreshAccessToken(refreshToken: string){
    const tokenHash = hashToken(refreshToken);

    const storedToken = await findRefreshToken(tokenHash);

    if(!storedToken){
        throw new AppError("Inavalid refresh token", 401)
    }
    if(storedToken.revokedAt){
        throw new AppError("Refresh token has been revoked", 401)
    }

    if (storedToken.expiresAt <= new Date()){
        throw new AppError("Refresh Token has expired", 401)
    }

    const newAccessToken = generateAccessToken(
        storedToken.userId
    )
    const newRefreshToken = generateAccessToken(
        storedToken.userId
    )

    const newTokenHash = hashToken(newRefreshToken)
    const newExpiresAt = new Date (
        Date.now() + 7*24*60*60*1000
    ) 

    await revokeRefreshToken(storedToken.id);

    await createRefreshToken({
        userId: storedToken.userId,
        tokenHash: newTokenHash,
        expiresAt: newExpiresAt,
    });

return {
    accessToken : newAccessToken,
    refreshToken : newRefreshToken
}
}