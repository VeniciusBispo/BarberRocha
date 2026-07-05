import dotenv from 'dotenv';

// Carrega as variáveis de ambiente a partir do arquivo .env
dotenv.config();

export interface EnvConfig {
    PORT: number;
    MONGODB_URI: string;
    JWT_SECRET: string;
    WHATSAPP_API_URL: string;
    WHATSAPP_API_TOKEN: string;
    WHATSAPP_SENDER_ENABLED: boolean;
    NODE_ENV: 'development' | 'production' | 'test';
}

const getEnvOrThrow = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`[CONFIG ERROR] A variável de ambiente obrigatória '${key}' está faltando.`);
    }
    return value;
};

export const env: EnvConfig = Object.freeze({
    PORT: parseInt(process.env.PORT || '3000', 10),
    MONGODB_URI: getEnvOrThrow('MONGODB_URI'),
    JWT_SECRET: getEnvOrThrow('JWT_SECRET'),
    WHATSAPP_API_URL: process.env.WHATSAPP_API_URL || '',
    WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN || '',
    WHATSAPP_SENDER_ENABLED: process.env.WHATSAPP_SENDER_ENABLED === 'true',
    NODE_ENV: (process.env.NODE_ENV as any) || 'development',
});
