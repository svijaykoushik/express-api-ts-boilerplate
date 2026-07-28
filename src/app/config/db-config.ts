import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './db-options';

config({ path: join(__dirname, '../../../.env') });

export const dataSource = new DataSource(getDatabaseConfig());

export default function getDataSource(): DataSource {
    return dataSource;
}
