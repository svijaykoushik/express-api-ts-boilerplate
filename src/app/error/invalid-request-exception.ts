import { ValidationError } from 'class-validator';
import { ApiException, ExceptionDetails } from './api-exception';

export class InvalidRequestException extends ApiException {
    constructor(
        message: string,
        errorCode: string,
        details: Record<string, any>
    ) {
        super(
            400,
            new ExceptionDetails('invalid_request', message, null, details)
        );
    }
}

export class InvalidRequestBodyException extends ApiException {
    constructor(validationErrors: (ValidationError | string[])[]) {
        super(
            400,

            new ExceptionDetails(
                'invalid_request',
                'Required parameters in request body are either missing or invalid',
                null,
                { validationErrors: validationErrors }
            )
        );
    }
}
