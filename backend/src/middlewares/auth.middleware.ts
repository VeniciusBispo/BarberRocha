import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.config';
import { AppError } from '../errors/app-error';

interface TokenPayload {
    id: string;
    isAdmin: boolean;
}

// Middleware para autenticar o token JWT na requisição
export const authenticateJWT: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('Access denied. Token missing or invalid format (Use: Bearer <token>).', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
        
        req.user = {
            id: decoded.id,
            isAdmin: decoded.isAdmin
        };
        
        next();
    } catch {
        next(new AppError('Unauthorized. Invalid or expired token.', 401));
    }
};

// Middleware para validar privilégios de administrador
export const requireAdmin: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.isAdmin) {
        throw new AppError('Access forbidden. Administrator credentials required.', 403);
    }
    next();
};
