export class ExceptionDetails {
    error_description?: string | undefined;
    data: any;
    constructor(
        data: Record<string, any>,
        error_description?: string | undefined
    ) {
        (this.data = data), (this.error_description = error_description);
    }
}

export class ApiException extends Error {
    httpCode = -1;
    details: ExceptionDetails;
    innerError: any;
    error_code: string;
    constructor(
        httpCode: number,
        message: string,
        error_code: string,
        details?: ExceptionDetails,
        innerError?: any
    ) {
        super(message);
        this.httpCode = httpCode;
        this.error_code = error_code;
        this.details = details;
        this.innerError = innerError;
    }
}
