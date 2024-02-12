import { existsSync } from 'fs';
import { config } from 'dotenv';
import { join } from 'path';
import { exit } from 'process';

// Load the configuration as soon as possible

if (existsSync(join(__dirname, '../.env'))) {
    config({ path: join(__dirname, '../.env') });
} else if (existsSync(join(__dirname, '../.env.example'))) {
    console.log(
        '❗ Caution: Default environment variables in use. ' +
            'Create a .env file and customize configurations ' +
            'for optimal security and tailored functionality.\n'
    );
    config({ path: join(__dirname, '../.env.example') });
} else {
    console.error(
        '❌ Failed start application\n',
        'Unable to load configuration'
    );
    exit(1);
}

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
