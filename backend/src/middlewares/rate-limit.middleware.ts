import rateLimit from 'express-rate-limit';
import { AppError } from '../errors/app-error';

// Limiter geral para toda a API (100 requisições a cada 15 minutos por IP)
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new AppError('Too many requests from this IP, please try again after 15 minutes.', 429));
    }
});

// Limiter mais estrito para rotas de autenticação (20 tentativas de login/registro a cada 15 minutos por IP)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new AppError('Too many authentication attempts from this IP, please try again after 15 minutes.', 429));
    }
});
