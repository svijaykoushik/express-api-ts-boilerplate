import { join } from 'path';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions, MigrationExecutor } from 'typeorm';
import { exit } from 'process';

config({ path: join(__dirname, '../../../.env') });

async function run() {
    const config: DataSourceOptions = {
        name: Date.now().toString(),
        type: 'mysql',
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT),
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        synchronize: false,
        logging: process.env.MYSQL_LOG_QUERY == 'true' || false,
        entities: [join(__dirname, './entities/*{.ts,.js}')],
        migrations: [join(__dirname, '../migrations/*{.ts,.js}')]
    };
    const connection = new DataSource(config);
    await connection.initialize();
    const migrationExecutor = new MigrationExecutor(connection);
    console.log('🔙 Reverting Last migration');
    console.log('Please wait... ⌛');
    await migrationExecutor.undoLastMigration();
}

run()
    .then(() => {
        console.log('🏁 Reverted last migration');
        exit(0);
    })
    .catch((err) => {
        console.error(err);
        console.error('❌ Failed to revert last migration');
        exit(1);
    });
