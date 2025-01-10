export class ExceptionDetails {
    error_code: string;
    data?: any;
    error_description?: string | undefined;
    error_uri?: string;
    innerError?: any;
    constructor(
        error_code: string,
        error_description?: string | undefined,
        error_uri?: URL | undefined,
        data?: Record<string, any>
    ) {
        (this.error_code = error_code),
            (this.data = data),
            (this.error_description = error_description),
            (this.error_uri = error_uri?.toString());
    }
}

export class ApiException extends Error {
    httpCode = -1;
    details: ExceptionDetails;
    constructor(httpCode: number, details: ExceptionDetails) {
        super(details.error_description || details.error_code);
        this.httpCode = httpCode;
        this.details = details;
    }
}
