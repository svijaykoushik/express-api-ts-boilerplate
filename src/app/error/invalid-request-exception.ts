import { ValidationError } from "class-validator";
import { ApiException, ExceptionDetails } from "./api-exception";

export class InvalidRequestException extends ApiException {
    constructor(message: string, errorCode: string, details: any) {
        super(
            400,
            message,
            new ExceptionDetails(errorCode, details)
        )
    }
}

export class InvalidRequestBodyException extends ApiException {
    constructor(validationErrors: (ValidationError | string[])[]) {
        super(
            400,
            'Required parameters in request body are either missing or invalid',
            new ExceptionDetails(
                'INVALID_REQUEST_BODY',
                validationErrors
            )
        )
    }
}
