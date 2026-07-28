import { expect } from 'chai';
import { runInTransaction } from './transaction';
import { dataSource } from '../config/db-config';
import { User } from '../models/entities/User';
import { RefreshToken } from '../models/entities/RefreshToken';

describe('Transaction Helper (runInTransaction)', function () {
    // Ensure the database is initialized
    before(async () => {
        if (!dataSource.isInitialized) {
            await dataSource.initialize();
        }
    });

    beforeEach(async () => {
        // Clean database tables in dependency order to prevent FK failures
        await dataSource.getRepository(RefreshToken).clear();
        await dataSource.getRepository(User).clear();
    });

    it('should successfully commit changes when no errors occur', async function () {
        const email = 'commit@test.com';

        const result = await runInTransaction(async (manager) => {
            const user = new User();
            user.email = email;
            user.password = 'password123';
            return await manager.save(user);
        });

        expect(result.id).to.not.be.undefined;

        // Verify user is in database
        const dbUser = await dataSource.getRepository(User).findOneBy({ email });
        expect(dbUser).to.not.be.null;
        expect(dbUser?.email).to.equal(email);
    });

    it('should rollback all transaction changes if an error is thrown', async function () {
        const email = 'rollback@test.com';

        try {
            await runInTransaction(async (manager) => {
                const user = new User();
                user.email = email;
                user.password = 'password123';
                await manager.save(user);

                // Throw error to trigger rollback
                throw new Error('Forced Rollback Error');
            });
            throw new Error('Test failed: runInTransaction did not throw');
        } catch (error: any) {
            expect(error.message).to.equal('Forced Rollback Error');
        }

        // Verify user is NOT in database
        const dbUser = await dataSource.getRepository(User).findOneBy({ email });
        expect(dbUser).to.be.null;
    });
});
