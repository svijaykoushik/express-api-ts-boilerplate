import { Repository } from 'typeorm';
import getDataSource from '../../config/db-config';
import { RefreshToken } from '../entities/RefreshToken';

export interface RefreshTokenRepository {
    saveRefreshToken: (
        this: Repository<RefreshToken>,
        userId: string,
        refreshToken: string
    ) => Promise<RefreshToken>;
}

export const refreshTokenRepository = getDataSource()
    .getRepository(RefreshToken)
    .extend<RefreshTokenRepository>({
        async saveRefreshToken(
            userId: string,
            refreshToken: string
        ): Promise<RefreshToken> {
            const date = new Date();
            const expiresAt = new Date(date);
            expiresAt.setDate(expiresAt.getDate() + 30);
            return await this.save({
                expiresAt,
                refreshToken,
                userId
            });
        }
    });
