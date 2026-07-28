import getDataSource from '../config/db-config';
import { exit } from 'process';

async function run() {
    const connection = getDataSource();
    await connection.initialize();
    console.log('Migration started 🏁');
    console.log('Please wait... ⌛');
    await connection.runMigrations();
}

run()
    .then(() => {
        console.log('Migration completed 🏁');
        exit(0);
    })
    .catch((err) => {
        console.error(err);
        console.error('❌ Migration failed');
        exit(1);
    });
