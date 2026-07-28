import { EntityManager } from 'typeorm';
import getDataSource from '../config/db-config';

/**
 * Runs a set of operations inside a database transaction.
 * Automatically handles connecting, starting, committing, rolling back, and releasing the connection.
 * 
 * @param runnable Callback function receiving the transaction's EntityManager
 */
export async function runInTransaction<T>(
    runnable: (entityManager: EntityManager) => Promise<T>
): Promise<T> {
    const queryRunner = getDataSource().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const result = await runnable(queryRunner.manager);
        await queryRunner.commitTransaction();
        return result;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
}
