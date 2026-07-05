import { env } from '../config/env.config';

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

// Códigos ANSI para colorir os logs no console do terminal
const Colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    blue: '\x1b[34m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

const LogLevelPriority: Record<LogLevel, number> = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};

class Logger {
    private getTimestamp(): string {
        return new Date().toISOString();
    }

    private getMinLevel(): LogLevel {
        if (env.NODE_ENV === 'production') {
            return 'INFO';
        }
        return 'DEBUG';
    }

    private shouldLog(level: LogLevel): boolean {
        const minPriority = LogLevelPriority[this.getMinLevel()];
        const levelPriority = LogLevelPriority[level];
        return levelPriority >= minPriority;
    }

    private formatMessage(level: LogLevel, message: string, color: string): string {
        const timestamp = `${Colors.dim}[${this.getTimestamp()}]${Colors.reset}`;
        const formattedLevel = `${Colors.bright}${color}[${level.padEnd(5)}]${Colors.reset}`;
        return `${timestamp} ${formattedLevel} ${message}`;
    }

    public debug(message: string, ...meta: any[]): void {
        if (!this.shouldLog('DEBUG')) return;
        console.debug(this.formatMessage('DEBUG', message, Colors.blue), ...meta);
    }

    public info(message: string, ...meta: any[]): void {
        if (!this.shouldLog('INFO')) return;
        console.info(this.formatMessage('INFO', message, Colors.green), ...meta);
    }

    public warn(message: string, ...meta: any[]): void {
        if (!this.shouldLog('WARN')) return;
        console.warn(this.formatMessage('WARN', message, Colors.yellow), ...meta);
    }

    public error(message: string, error?: any, ...meta: any[]): void {
        if (!this.shouldLog('ERROR')) return;
        const formattedMessage = this.formatMessage('ERROR', message, Colors.red);
        if (error instanceof Error) {
            console.error(formattedMessage, ...meta);
            console.error(`${Colors.red}${error.stack || error.message}${Colors.reset}`);
        } else if (error) {
            console.error(formattedMessage, error, ...meta);
        } else {
            console.error(formattedMessage, ...meta);
        }
    }
}

export const logger = new Logger();
