import { logger } from './logger';
import { BaseError } from './base-error';

export class ErrorHandler {
    logger: any;

    constructor(logger: any) {
        this.logger = logger;
    }

    public async handleError(err: Error): Promise<void> {
        logger.error(err);
    }

    public isTrustedError(error: Error) {
        return error instanceof BaseError && error.isOperational;
    }
}
