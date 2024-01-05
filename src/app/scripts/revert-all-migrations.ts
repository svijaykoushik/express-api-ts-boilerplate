import { join } from 'path';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions, MigrationExecutor } from 'typeorm';
import { exit } from 'process';
import { createInterface } from 'readline';

config({ path: join(__dirname, '../../../.env') });

async function run() {
    if (await confirmAction()) {
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
        console.log('⏮️ Reverting All migrations');
        console.log('Please wait... ⌛');
        const migrations = await migrationExecutor.getAllMigrations();
        let count = 0;
        for (const migration of migrations) {
            await migrationExecutor.undoLastMigration();
            count++;
            console.log(
                `✳️ Reverted ${count}/${migrations.length} ${migration.name}`
            );
        }
        return true;
    } else {
        return false;
    }
}

async function confirmAction() {
    return new Promise<boolean>((resolve, reject) => {
        try {
            const rl = createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question(
                '‼️ Reverting all migrations can cause issues in the applicaion. Are you sure? (y/n)',
                (response) => {
                    if (response.toLowerCase() === 'y') {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                    rl.close();
                }
            );
        } catch (e) {
            reject(e);
        }
    });
}

run()
    .then((val) => {
        if (val) {
            console.log('🏁 Migrations reverted');
        } else {
            console.log('🚫 Revert All migrations operation cancelled');
        }
        exit(0);
    })
    .catch((err) => {
        console.error(err);
        console.error('❌ Migration failed');
        exit(1);
    });
