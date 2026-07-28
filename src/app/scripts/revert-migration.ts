import getDataSource from '../config/db-config';
import { MigrationExecutor } from 'typeorm';
import { exit } from 'process';

async function run() {
    const connection = getDataSource();
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
