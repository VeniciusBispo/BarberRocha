import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bookingRoutes from './routes/booking.routes';
import authRoutes from './routes/auth.routes';
import appointmentRoutes from './routes/appointment.routes';
import { requestLogger } from './middlewares/logging.middleware';
import { globalErrorHandler } from './middlewares/error.middleware';
import { apiLimiter } from './middlewares/rate-limit.middleware';
import { AppError } from './errors/app-error';

const app: Application = express();

// 1. Logger de Requisições (primeiro middleware para rastreabilidade total)
app.use(requestLogger);

// 2. Configuração de Segurança CORS
app.use(cors({
    origin: '*', // Para produção real, restrinja aos domínios confiáveis
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Rate Limiting Geral para proteção da API
app.use('/api', apiLimiter);

// 4. Body Parsers (Leitura do body em JSON e URL Encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Mapeamento de Rotas
app.use('/api', bookingRoutes);
app.use('/api', authRoutes);
app.use('/api', appointmentRoutes);

// Rota de Health Check (Status da API)
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        status: 'UP',
        message: 'Barbearia Rocha 20 API is running smoothly',
        timestamp: new Date()
    });
});

// 6. Tratamento de Rotas Não Encontradas (404)
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 7. Middleware Global de Tratamento de Erros
app.use(globalErrorHandler);

export default app;
