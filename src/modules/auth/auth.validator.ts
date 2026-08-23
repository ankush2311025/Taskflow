import {z} from 'zod';

export const registerSchema = z.object({
    body: z.object({
        name: z.string().trim().min(2).max(50),
        email: z.email(),
        password: z.string().min(8).max(50),
        organizationName: z.string().trim().min(2).max(100),
    })
})

export const loginSchema = z.object({
    body: z.object({
        email: z.email(),
        password: z.string().min(8).max(50),
    })
})

export const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken : z.string().min(1),
    })
})