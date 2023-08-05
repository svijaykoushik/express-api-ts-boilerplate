export class ExceptionDetails {
    errorCode: string;
    data: any;
    constructor(errorCode: string, data: any) {
        this.errorCode = errorCode,
            this.data = data;
    }
}


export class ApiException extends Error {
    httpCode = -1;
    details: ExceptionDetails;
    innerError: any;
    constructor(httpCode: number, message: string, details?: ExceptionDetails, innerError?: any) {
        super(message);
        this.httpCode = httpCode;
        this.details = details;
        this.innerError = innerError;
    }
}