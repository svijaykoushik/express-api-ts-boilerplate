import getDataSource from '../config/db-config';
import { MigrationExecutor } from 'typeorm';
import { exit } from 'process';
import { createInterface } from 'readline';

async function run() {
    if (await confirmAction()) {
        const connection = getDataSource();
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
