import { App } from './app';
import getDataSource from './app/config/db-config';
import { config } from 'dotenv';
import { join } from 'path';

class Server {
    public static async main(): Promise<void> {
        const app = new App();
        await getDataSource().initialize();
        app.listen();
    }
}
config({ path: join(__dirname, '../.env') });
Server.main().catch((e) => console.error('❌ Failed start application\n', e));
