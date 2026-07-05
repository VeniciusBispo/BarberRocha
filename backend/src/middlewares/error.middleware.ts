import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { logger } from '../utils/logger';
import { env } from '../config/env.config';

// Função para tratar erros de cast do Mongoose (ex: ID inválido)
const handleCastErrorDB = (err: any): AppError => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

// Função para tratar erros de campos duplicados no MongoDB (ex: telefone repetido)
const handleDuplicateFieldsDB = (err: any): AppError => {
    const key = Object.keys(err.keyValue)[0];
    const value = err.keyValue[key];
    const message = `Duplicate field value: '${value}' for field '${key}'. Please use another value!`;
    return new AppError(message, 409);
};

// Função para tratar erros de validação do Mongoose
const handleValidationErrorDB = (err: any): AppError => {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

// Trata erros de assinatura JWT
const handleJWTError = (): AppError => new AppError('Invalid token. Please log in again.', 401);

// Trata erros de expiração JWT
const handleJWTExpiredError = (): AppError => new AppError('Your token has expired. Please log in again.', 401);

const sendErrorDev = (err: AppError, res: Response): void => {
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err: AppError, res: Response): void => {
    // Erros conhecidos (operacionais) - envia mensagem limpa ao cliente
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message
        });
    } else {
        // Erro desconhecido ou de infraestrutura (programação, banco offline, etc.) - não expõe detalhes internos
        logger.error('UNEXPECTED SERVER ERROR:', err);
        res.status(500).json({
            success: false,
            status: 'error',
            message: 'Something went very wrong on the server!'
        });
    }
};

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err, message: err.message, stack: err.stack };
        error.name = err.name;
        error.code = err.code;

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};
