import { Logger } from './logger';

/**
 * Provides a factory for creating loggers.
 */
export class LoggerFactory {

    /**
     * Create a new logger based on the specified name.
     */
    public static create(name: string): Logger {
        return new Logger(name);
    }
}