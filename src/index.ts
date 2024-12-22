import { accessSync, constants, existsSync } from 'fs';
import { config } from 'dotenv';
import { dirname, join } from 'path';
import { exit } from 'process';

// Load the configuration as soon as possible

if (existsSync(join(__dirname, '../.env'))) {
    config({ path: join(__dirname, '../.env') });
}

if (
    !process.env.APP_PORT ||
    !process.env.APP_URL ||
    !process.env.TYPEORM_DATABASE ||
    !process.env.TYPEORM_LOG_QUERY ||
    !process.env.SWAGGER_PORT ||
    !process.env.SWAGGER_DOMAIN
) {
    process.env.APP_PORT = process.env.APP_PORT || (5050).toString();
    process.env.APP_URL = process.env.APP_URL || '0.0.0.0';
    process.env.TYPEORM_DATABASE =
        process.env.TYPEORM_DATABASE || 'play_ground.db';
    process.env.TYPEORM_LOG_QUERY =
        process.env.TYPEORM_LOG_QUERY || false.toString();
    process.env.SWAGGER_PORT = process.env.SWAGGER_PORT || (5050).toString();
    process.env.SWAGGER_DOMAIN = process.env.SWAGGER_DOMAIN || '0.0.0.0';

    console.log(
        '❗ Caution: Default environment variables in use. ' +
            'Create a .env file and customize configurations ' +
            'for optimal security and tailored functionality.\n'
    );
}
console.log('process.env.TYPEORM_DATABASE',process.env.TYPEORM_DATABASE);

try {
    accessSync(dirname(process.env.TYPEORM_DATABASE), constants.R_OK | constants.W_OK);
    console.log('can read/write',dirname(process.env.TYPEORM_DATABASE));
  } catch (err) {
    console.error('no access!',dirname(process.env.TYPEORM_DATABASE));
  }

// if (existsSync(join(__dirname, '../.env'))) {
//     config({ path: join(__dirname, '../.env') });
// } else if (existsSync(join(__dirname, '../.env.example'))) {
//     console.log(
//         '❗ Caution: Default environment variables in use. ' +
//             'Create a .env file and customize configurations ' +
//             'for optimal security and tailored functionality.\n'
//     );
//     config({ path: join(__dirname, '../.env.example') });
// } else {
//     console.error(
//         '❌ Failed start application\n',
//         'Unable to load configuration'
//     );
//     exit(1);
// }

import { App } from './app';
import getDataSource from './app/config/db-config';

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
