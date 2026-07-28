import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

export const getDatabaseConfig = (): DataSourceOptions => {
    const dbType = (process.env.DB_TYPE || 'sqlite') as any;

    const baseConfig = {
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.TYPEORM_LOG_QUERY === 'true' || false,
        entities: [join(__dirname, '../models/entities/*{.ts,.js}')],
        migrations: [join(__dirname, '../models/migrations/*{.ts,.js}')],
    };

    if (dbType === 'sqlite') {
        return {
            ...baseConfig,
            type: 'sqlite',
            database: process.env.TYPEORM_DATABASE || 'play_ground.db',
        };
    }

    return {
        ...baseConfig,
        type: dbType,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        extra: {
            max: process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX) : 10,
            idleTimeoutMillis: 30000,
        },
    } as DataSourceOptions;
};
