export class APIError extends Error {
    private statusCode: number;
    private errorCode: string;
    private errorMessage: string;
    private innerError?: Error | APIError;

    public constructor(
        statusCode: number,
        code: string,
        message: string,
        innerError?: Error | APIError
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = code;
        this.errorMessage = message;
        this.innerError = innerError;
    }

    public get Code(): string {
        return this.errorCode;
    }

    public get Message(): string {
        return this.errorMessage;
    }

    public get InnerError(): Error | APIError {
        return this.innerError;
    }

    public get HttpStatusCode(): number {
        return this.statusCode;
    }
}
