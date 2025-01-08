import { ExceptionDetails, ApiException } from './api-exception';

export class UnhandledException extends ApiException {
    constructor(error: any, error_code?: string, details?: ExceptionDetails) {
        super(
            500,
            'Unhandled error has occured',
            error_code || 'unhandled_exception',
            details ? details : null,
            error
        );
    }
}
