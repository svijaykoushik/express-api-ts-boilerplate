import { ExceptionDetails, ApiException } from "./api-exception";


export class UnhandledException extends ApiException {
    constructor(
        error: any,
        details?: ExceptionDetails
    ) {
        super(
            500,
            'Unhandled error has occured',
            details ? details : null,
            error
        );
    }
}
