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
            const accessToken = await this.generateAccessToken({
                email: user.email,
                id: user.id
            });
            res.status(201).send(
                new ApiResponse(201, {
                    userinfo: {
                        email: user.email,
                        id: user.id
                    },
                    access_token: accessToken,
                    token_type: 'bearer'
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
                        res.status(201).send(
                            new ApiResponse(200, {
                                userinfo: result.userinfo,
                                access_token: result.access_token,
                                token_type: 'bearer'
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
                new UnhandledException(
                    e,
                    new ExceptionDetails('auth-registration-failed')
                )
            );
        }
    }

    public async generateAccessToken(
        userinfo: Pick<User, 'email' | 'id'>
    ): Promise<string> {
        return await new Promise<string>((resolve, reject) => {
            sign(
                {
                    userinfo: {
                        ...userinfo
                    }
                },
                randomBytes(32),
                {
                    algorithm: 'none',
                    expiresIn: '1h',
                    issuer: `http://${process.env.APP_DOMAIN}:${process.env.APP_PORT}/auth`,
                    jwtid: v4(),
                    subject: userinfo.id
                },
                (error, encoded) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(encoded);
                }
            );
        });
    }

    private async handlePasswordGrant(email: string, password: string) {
        const user = await this.authService.signInWithEmailAndPassword(
            email,
            password
        );
        const accessToken = await this.generateAccessToken({
            email: user.email,
            id: user.id
        });
        return {
            userinfo: {
                email: user.email,
                id: user.id
            },
            access_token: accessToken
        };
    }
}
