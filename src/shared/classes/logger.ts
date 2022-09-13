import bunyan, { LogLevel } from 'bunyan';

export const logger = bunyan.createLogger({
    name: 'stockly',
    streams: [
        {
            stream: process.stdout,
            level: (process.env.LOG_LEVEL || 'info') as LogLevel,
        },
    ],
});

logger.info('Stockly logger started');
