import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../../services/auth/auth-service';
import { plainToInstance } from 'class-transformer';
import { RegisterDTO, TokenDTO } from '../../dtos';
import { UnhandledException } from '../../error/unhandled-exception';
import { ApiException, ExceptionDetails } from '../../error/api-exception';
import { User } from '../../models/entities/User';
import { sign } from 'jsonwebtoken';
import { v4 } from 'uuid';
import { ApiResponse } from '../../helpers/api-response';
import { randomBytes } from 'crypto';
import { GrantTypes } from '../../enums';

export class AuthController {
    public constructor(private authService: AuthService) {}

    public async registerWithEmailAndPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const payload = plainToInstance(RegisterDTO, req.body);
        try {
            const user = await this.authService.registerWithEmailAndPassword(
                payload.email,
                payload.password
            );
            const accessToken = await this.authService.generateAccessToken({
                email: user.email,
                id: user.id
            });
            const refreshToken = await this.authService.generateRefreshToken({
                id: user.id
            });
            res.status(201).send(
                new ApiResponse(201, {
                    userinfo: {
                        email: user.email,
                        id: user.id
                    },
                    access_token: accessToken,
                    token_type: 'bearer',
                    refresh_token: refreshToken
                })
            );
        } catch (e) {
            if (e instanceof ApiException) {
                next(e);
                return;
            }
            next(
                new UnhandledException(
                    e,
                    new ExceptionDetails('auth-registration-failed')
                )
            );
        }
    }

    public async authenticate(req: Request, res: Response, next: NextFunction) {
        const payload = plainToInstance(TokenDTO, req.body);
        try {
            switch (payload.grant_type) {
                case GrantTypes.Password:
                    {
                        const result = await this.handlePasswordGrant(
                            payload.email,
                            payload.password
                        );
                        res.status(200).send(
                            new ApiResponse(200, {
                                userinfo: result.userinfo,
                                access_token: result.access_token,
                                expires_in: 3600,
                                token_type: 'bearer',
                                refresh_token: result.refresh_token
                            })
                        );
                    }
                    break;
                case GrantTypes.RefreshToken:
                    {
                        const refreshUserInfo =
                            await this.authService.verifyTokenAndGetPayload(
                                payload.refresh_token,
                                process.env.REFRESH_TOKEN_SECRET
                            );

                        const userinfo = await this.authService.getUserInfo(
                            refreshUserInfo.id
                        );

                        const nextAccessToken =
                            await this.authService.generateAccessToken({
                                id: userinfo.id,
                                email: userinfo.email
                            });
                        res.status(200).send(
                            new ApiResponse(200, {
                                access_token: nextAccessToken,
                                token_type: 'bearer',
                                expires_in: 3600
                            })
                        );
                    }
                    break;
                default:
                    next(
                        new ApiException(
                            400,
                            new ExceptionDetails(
                                'invalid_grant',
                                'Invalid grant'
                            )
                        )
                    );
            }
        } catch (e) {
            if (e instanceof ApiException) {
                next(e);
                return;
            }
            next(
                new UnhandledException(e, new ExceptionDetails('auth-failed'))
            );
        }
    }

    private async handlePasswordGrant(email: string, password: string) {
        const user = await this.authService.signInWithEmailAndPassword(
            email,
            password
        );
        const accessToken = await this.authService.generateAccessToken({
            email: user.email,
            id: user.id
        });
        const refreshToken = await this.authService.generateRefreshToken({
            id: user.id
        });
        return {
            userinfo: {
                email: user.email,
                id: user.id
            },
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }
}
