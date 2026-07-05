import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { registerSchema, loginSchema, changePasswordSchema } from '../validators/auth.validator';
import { asyncHandler } from '../utils/async-handler';
import { authLimiter } from '../middlewares/rate-limit.middleware';

const router = Router();
const authController = new AuthController();

// Mapear rotas de autenticação com validações e rate-limiting
router.post(
    '/auth/register', 
    authLimiter, 
    validateRequest(registerSchema), 
    asyncHandler(authController.register)
);

router.post(
    '/auth/login', 
    authLimiter, 
    validateRequest(loginSchema), 
    asyncHandler(authController.login)
);

// Rota protegida para alteração de senha
router.patch(
    '/auth/change-password', 
    authenticateJWT, 
    validateRequest(changePasswordSchema), 
    asyncHandler(authController.changePassword)
);

export default router;
