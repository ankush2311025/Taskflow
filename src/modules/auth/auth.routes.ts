import {register, login, refresh} from './auth.controller.js'
import { Router} from 'express'
import { validate} from '../../middlewares/validate.middleware.js'
import { loginSchema, registerSchema, refreshTokenSchema} from './auth.validator.js';
import {authenticate} from "../../middlewares/auth.middleware.js"

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login',validate(loginSchema), login)
router.post('/refresh', validate(refreshTokenSchema), refresh)
router.get('/me', authenticate, async (req, res)=> {
    res.json({
        success: true,
        userId: req.userId
    })
})

export default router;