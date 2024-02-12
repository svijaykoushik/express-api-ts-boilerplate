import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
config({ path: join(__dirname, '../../../.env') });
export const dataSource = new DataSource({
    type: 'sqlite',
    database: process.env.TYPEORM_DATABASE,
    synchronize: false,
    logging: process.env.TYPEORM_LOG_QUERY == 'true' || false,
    entities: [join(__dirname, './entities/*{.ts,.js}')]
});

export default function getDataSource(): DataSource {
    return dataSource;
}
