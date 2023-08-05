import { config } from "dotenv";
import { join } from "path";
import { DataSource } from "typeorm";
config({ path: join(__dirname, '../../../.env') });
export const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: false,
    logging: process.env.MYSQL_LOG_QUERY == 'true' || false,
    entities: [join(__dirname, './entities/*{.ts,.js}')]
});

export default function getDataSource(): DataSource {
    return dataSource;
}