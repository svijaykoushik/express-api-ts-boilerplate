import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ApiException, ExceptionDetails } from '../error/api-exception';
import { AuthService } from '../services/auth/auth-service';
import { UnhandledException } from '../error/unhandled-exception';

export function AuthorizationMiddleware(authService: AuthService) {
    return (async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.headers.authorization?.split(' ')?.[1];
        if (!accessToken) {
            next(
                new ApiException(
                    401,
                    new ExceptionDetails(
                        'invalid_grant',
                        'Token missing. Access token is required to serve this request'
                    )
                )
            );
            return;
        }
        try {
            const userinfo = await authService.verifyTokenAndGetPayload(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET
            );

            if (!userinfo) {
                return next(
                    new ApiException(
                        401,
                        new ExceptionDetails(
                            'invalid_grant',
                            'Invalid or expired token.'
                        )
                    )
                );
            }

            req['userinfo'] = JSON.parse(JSON.stringify(userinfo)); //structuredClone is not available in nodejs, using JSON parse and stringify instead
            next();
        } catch (error) {
            console.error('Token verification error:', error); // Important: Log the error for debugging
            if (error instanceof ApiException) {
                return next(error);
            }
            return next(new UnhandledException(error));
        }
    }) as RequestHandler;
}
