import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Scope } from '../../types/scope';
import { ApiException, ExceptionDetails } from '../error/api-exception';
import { UnhandledException } from '../error/unhandled-exception';
import { AuthService } from '../services/auth/auth-service';

export function AuthorizationMiddleware(
    authService: AuthService,
    requiredScopes?: Scope[]
) {
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
            const { scope, userinfo } =
                await authService.verifyTokenAndGetPayload(
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

            if (
                requiredScopes?.length &&
                scope
                    .split(' ')
                    .every((s) => requiredScopes.includes(s as Scope)) === false
            ) {
                return next(
                    new ApiException(
                        403,
                        new ExceptionDetails(
                            'invalid_scope',
                            'Invalid scope. Access denied.'
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
