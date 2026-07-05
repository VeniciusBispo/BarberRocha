import app from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env.config';
import { logger } from './utils/logger';
import mongoose from 'mongoose';
import dns from 'dns';

// Forçar a resolução de DNS do Node a preferir IPv4
dns.setDefaultResultOrder('ipv4first');

// Forçar o resolvedor c-ares do Node a usar os servidores DNS do Google, 
// contornando o bug do Windows onde resolvedores IPv6 falham em consultas SRV
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (error) {
    logger.warn('[DNS CONFIG] Falha ao definir servidores DNS do Google:', error);
}

const PORT = env.PORT;

const startServer = async () => {
    try {
        // 1. Conectar ao Banco de Dados
        await connectDatabase();

        // 2. Iniciar Servidor Express
        const server = app.listen(PORT, () => {
            logger.info(`=============================================`);
            logger.info(`  Server is running on: http://localhost:${PORT}`);
            logger.info(`  Health check: http://localhost:${PORT}/api/health`);
            logger.info(`  Environment: ${env.NODE_ENV}`);
            logger.info(`=============================================`);
        });

        // 3. Tratamento Graceful Shutdown (Encerramento Limpo)
        const gracefulShutdown = (signal: string) => {
            logger.info(`Received ${signal}. Starting graceful shutdown...`);
            
            server.close(async () => {
                logger.info('Express server closed.');
                
                try {
                    await mongoose.connection.close();
                    logger.info('MongoDB connection closed.');
                    process.exit(0);
                } catch (err) {
                    logger.error('Error during MongoDB disconnection:', err);
                    process.exit(1);
                }
            });
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        logger.error('CRITICAL: Server startup failed:', error);
        process.exit(1);
    }
};

startServer();
