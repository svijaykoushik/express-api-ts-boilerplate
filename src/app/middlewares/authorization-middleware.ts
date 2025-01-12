import { NextFunction, Request, Response } from 'express';
import { ApiException, ExceptionDetails } from '../error/api-exception';
import { AuthService } from '../services/auth/auth-service';
import { userRepository } from '../models/repositories/UserRepository';
import { refreshTokenRepository } from '../models/repositories/RefreshTokenRepository';

export async function AuthorizationMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authService = new AuthService(userRepository, refreshTokenRepository);
    const accessToken = req.headers.authorization?.split(' ')?.[1];
    if (!accessToken) {
        return next(
            new ApiException(
                401,
                new ExceptionDetails(
                    'invalid_grant',
                    'Token missing. Access token is required to serve this request'
                )
            )
        );
    }
    const userinfo = await authService.verifyTokenAndGetPayload(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
    );

    req['userinfo'] = structuredClone(userinfo);
    next();
}
