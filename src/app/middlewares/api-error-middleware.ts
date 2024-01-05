import { Request, Response, NextFunction } from 'express';
import { ApiException } from '../error/api-exception';

export function apiErrorHandler(
    error: ApiException,
    request: Request,
    response: Response,
    next: NextFunction
): void {
    console.error(error);
    response.status(error.httpCode).send({
        errorMessage: error.message,
        data: error.details
    });
}
