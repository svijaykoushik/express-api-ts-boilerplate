import { compare, hash } from 'bcrypt';
import { isEmail } from 'class-validator';
import {
    JsonWebTokenError,
    JwtPayload,
    sign,
    TokenExpiredError,
    verify,
    VerifyErrors
} from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { AccessTokenPayload } from '../../../types/access-token-payload';
import { Scope } from '../../../types/scope';
import { UserInfo } from '../../../types/userinfo';
import { ApiException, ExceptionDetails } from '../../error/api-exception';
import { RefreshToken } from '../../models/entities/RefreshToken';
import { User } from '../../models/entities/User';
import { RefreshTokenRepository } from '../../models/repositories/RefreshTokenRepository';
import { UserRepository } from '../../models/repositories/UserRepository';

export class AuthService {
    public constructor(
        private userRepository: Repository<User> & UserRepository,
        private refreshTokenRepository: Repository<RefreshToken> &
            RefreshTokenRepository
    ) {}

    public async registerWithEmailAndPassword(email: string, password: string) {
        let user: User = await this.userRepository.findOneByEmail(email);
        if (user) {
            throw new ApiException(
                409,
                new ExceptionDetails('user_exists', 'User already exists')
            );
        }
        user = await this.userRepository.saveUser({
            email,
            password: await hash(password, 10)
        });

        return user;
    }

    public async signInWithEmailAndPassword(email: string, password: string) {
        const user: User = await this.userRepository.findOneByEmail(email);
        if (!user) {
            throw new ApiException(
                400,
                new ExceptionDetails(
                    'invalid_credentials',
                    'Invalid credentials'
                )
            );
        }

        if ((await compare(password, user.password)) === false) {
            throw new ApiException(
                400,
                new ExceptionDetails(
                    'invalid_credentials',
                    'Invalid credentials'
                )
            );
        }

        return user;
    }

    public async generateAccessToken(
        userinfo: Pick<User, 'email' | 'id'>,
        scopes?: Scope[]
    ): Promise<string> {
        return await new Promise<string>((resolve, reject) => {
            sign(
                {
                    scope:
                        scopes?.join(' ') ||
                        `${Scope.READ} ${Scope.WRITE} ${Scope.PROFILE}`,
                    userinfo: {
                        ...userinfo
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    algorithm: 'HS256',
                    expiresIn: '1h',
                    issuer: `http://${process.env.APP_URL}:${process.env.APP_PORT}/auth`,
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

    public async generateRefreshToken(userinfo: Pick<User, 'id'>) {
        const jwt = await new Promise<string>((resolve, reject) => {
            sign(
                {
                    userinfo: {
                        ...userinfo
                    }
                },
                process.env.REFRESH_TOKEN_SECRET,
                {
                    algorithm: 'HS256',
                    expiresIn: '30d',
                    issuer: `http://${process.env.APP_URL}:${process.env.APP_PORT}/auth`,
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

        const refreshToken = await this.refreshTokenRepository.saveRefreshToken(
            userinfo.id,
            jwt
        );
        return refreshToken.refreshToken;
    }

    public async verifyTokenAndGetPayload(token: string, secret: string) {
        return await new Promise<AccessTokenPayload>((resolve, reject) => {
            verify(
                token,
                secret,
                (error: VerifyErrors, decoded: JwtPayload) => {
                    if (error && error instanceof TokenExpiredError) {
                        reject(
                            new ApiException(
                                401,
                                new ExceptionDetails(
                                    'invalid_grant',
                                    'Token Expired. Please reauthorize.',
                                    null,
                                    {
                                        expiredAt: error.expiredAt
                                    }
                                )
                            )
                        );
                        return;
                    }
                    if (error && error instanceof JsonWebTokenError) {
                        reject(
                            new ApiException(
                                401,
                                new ExceptionDetails(
                                    'invalid_grant',
                                    'Invalid Token'
                                )
                            )
                        );
                        return;
                    }

                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve({
                        scope: decoded.scope,
                        userinfo: decoded.userinfo as UserInfo
                    });
                }
            );
        });
    }

    public async getUserInfo(idOrEmail: string): Promise<UserInfo> {
        let userinfo: UserInfo;
        if (isEmail(idOrEmail)) {
            userinfo = await this.userRepository.findOneByEmail(idOrEmail);
        } else {
            userinfo = await this.userRepository.findOneBy({
                id: idOrEmail
            });
        }
        if (!userinfo) {
            throw new ApiException(
                404,
                new ExceptionDetails(
                    'resource_not_found',
                    'User Info could not be found'
                )
            );
        }

        return {
            id: userinfo.id,
            email: userinfo.email
        };
    }
}
