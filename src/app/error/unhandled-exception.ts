import { ExceptionDetails, ApiException } from './api-exception';

export class UnhandledException extends ApiException {
    constructor(error: any, details?: ExceptionDetails) {
        super(
            500,
            new ExceptionDetails(
                details?.error_code || 'unhandled_error',
                details?.error_description || 'Something broke!',
                null,
                {
                    error,
                    error_data: details?.data
                }
            )
        );
    }
}
