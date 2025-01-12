import 'reflect-metadata';
import { config } from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';
import { exit } from 'process';
import { App } from './app';
import getDataSource from './app/config/db-config';
import { randomBytes } from 'crypto';

// Load the configuration as soon as possible

if (existsSync(join(__dirname, '../.env'))) {
    config({ path: join(__dirname, '../.env') });
}

if (!process.env.TYPEORM_DATABASE || !process.env.TYPEORM_LOG_QUERY) {
    process.env.TYPEORM_DATABASE =
        process.env.TYPEORM_DATABASE || 'play_ground.db';
    process.env.TYPEORM_LOG_QUERY =
        process.env.TYPEORM_LOG_QUERY || false.toString();

    console.log(
        '❗ Caution: Default environment variables in use. ' +
            'Create a .env file and customize configurations ' +
            'for optimal security and tailored functionality.\n'
    );
}

process.env.SWAGGER_PORT = process.env.SWAGGER_PORT || (5050).toString();
process.env.SWAGGER_DOMAIN = process.env.SWAGGER_DOMAIN || 'localhost';

process.env.APP_PORT = process.env.APP_PORT || (5050).toString();
process.env.APP_URL = process.env.APP_URL || '0.0.0.0';
process.env.ACCESS_TOKEN_SECRET =
    process.env.ACCESS_TOKEN_SECRET || randomBytes(32).toString('base64');
process.env.REFRESH_TOKEN_SECRET =
    process.env.REFRESH_TOKEN_SECRET || randomBytes(32).toString('base64');

class Server {
    public static async main(): Promise<void> {
        const app = new App();
        await getDataSource().initialize();
        app.listen();
    }
}

Server.main().catch((e) => {
    console.error('❌ Failed start application\n', e);
    exit(1);
});
