import pino from 'pino';

export const logger = pino({
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`
});
