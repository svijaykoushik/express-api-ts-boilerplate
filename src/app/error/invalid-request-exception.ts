import { ValidationError } from 'class-validator';
import { ApiException, ExceptionDetails } from './api-exception';

export class InvalidRequestException extends ApiException {
    constructor(
        message: string,
        errorCode: string,
        details: Record<string, any>
    ) {
        super(400, message, 'invalid_request', new ExceptionDetails(details));
    }
}

export class InvalidRequestBodyException extends ApiException {
    constructor(validationErrors: (ValidationError | string[])[]) {
        super(
            400,
            'Required parameters in request body are either missing or invalid',
            'invalid_request',
            new ExceptionDetails({ validationErrors: validationErrors })
        );
    }
}
