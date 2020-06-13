import { Request, Response, NextFunction } from 'express';
import { APIError } from '../error/api-error';

export function apiErrorHandler(error: APIError, request: Request, response: Response, next: NextFunction): void {
    console.error(error);
    response.status(error.HttpStatusCode).send({
        errorCode: error.Code,
        errorMessage: error.Message
    });
}
