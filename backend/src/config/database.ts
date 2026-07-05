import mongoose from 'mongoose';
import { env } from './env.config';
import { logger } from '../utils/logger';
import { User } from '../models/user.model';

// Semeador de contas de administradores pré-configurados
const seedAdmins = async (): Promise<void> => {
    try {
        const defaultAdmins = [
            { name: 'Viny Admin', phone: 'viny159', password: '123', isAdmin: true, mustChangePassword: true },
            { name: 'Rocha Admin', phone: 'Rocha123', password: '123', isAdmin: true, mustChangePassword: true }
        ];

        for (const adminData of defaultAdmins) {
            const exists = await User.findOne({ phone: adminData.phone }).lean();
            if (!exists) {
                const admin = new User(adminData);
                await admin.save(); // o pre('save') vai hashear a senha automaticamente
                logger.info(`[SEED] Administrador pré-configurado '${adminData.phone}' semeado com sucesso.`);
            }
        }
    } catch (error) {
        logger.error('[SEED] Erro ao semear administradores pré-configurados:', error);
    }
};

export const connectDatabase = async (): Promise<void> => {
    try {
        logger.info('Connecting to MongoDB...');
        
        // Mongoose 8+ utiliza pool de conexões otimizado por padrão (maxPoolSize: 100)
        await mongoose.connect(env.MONGODB_URI);
        
        logger.info('MongoDB successfully connected!');
        
        // Executa a semente de administradores
        await seedAdmins();
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    }

    // Monitorar eventos de conexão pós-inicialização
    mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection lost error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });
};
