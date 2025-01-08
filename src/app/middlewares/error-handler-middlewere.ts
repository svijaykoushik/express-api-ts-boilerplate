import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../helpers/api-response';

export function unhandledErrorHandler(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
): void {
    console.error({
        name: error.name,
        message: error.message,
        stack: error.stack
    });
    response
        .status(500)
        .send(
            new ApiResponse(
                500,
                { error: 'unhandled_error' },
                'something broke!'
            )
        );
}

export function routeErrorHandler(
    request: Request,
    response: Response,
    next: NextFunction
): void {
    if (!request.route) {
        response.status(404).send({
            error: `Cannot ${request.method} ${request.path}`
        });
    }
    next();
}
