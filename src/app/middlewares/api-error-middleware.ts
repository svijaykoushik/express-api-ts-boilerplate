import { Request, Response, NextFunction } from 'express';
import { ApiException } from '../error/api-exception';
import { ApiResponse } from '../helpers/api-response';

export function apiErrorHandler(
    error: ApiException,
    request: Request,
    response: Response,
    next: NextFunction
): void {
    console.error(error);
    const data: Record<string, any> = {
        inner_error: error.innerError
    };
    if (error.details) {
        for (const [key, val] of Object.entries(error.details)) {
            data[key] = val;
        }
    }
    response.status(error.httpCode).send(
        new ApiResponse(
            error.httpCode,
            {
                error: error.error_code,
                details: error.details,
                inner_error: error.innerError
            },
            error.message
        )
    );
}
