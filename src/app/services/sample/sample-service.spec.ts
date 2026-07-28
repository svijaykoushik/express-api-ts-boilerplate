import { SampleService } from './sample-service';
import { expect, assert } from 'chai';
import { dataSource } from '../../config/db-config';
import { User } from '../../models/entities/User';
import { RefreshToken } from '../../models/entities/RefreshToken';
import sinon from 'sinon';

describe('Sample service', () => {
    let sampleService: SampleService;

    before(async () => {
        if (!dataSource.isInitialized) {
            await dataSource.initialize();
        }
        sampleService = new SampleService();
    });

    beforeEach(async () => {
        await dataSource.getRepository(RefreshToken).clear();
        await dataSource.getRepository(User).clear();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should create an instance', () => {
        expect(sampleService).to.be.instanceOf(SampleService);
    });

    describe('getSampleResponse()', () => {
        it('should return a string', () => {
            assert.isString(sampleService.getSampleResponse());
        });
        it('should return "Hello there!"', () => {
            assert.strictEqual(
                sampleService.getSampleResponse(),
                'Hello there!'
            );
        });
    });

    describe('createSampleUserAndQueueJob()', () => {
        it('should transactionally save the user and trigger a background welcome job', async () => {
            const consoleSpy = sinon.spy(console, 'log');
            const email = 'demotask@test.com';

            const user = await sampleService.createSampleUserAndQueueJob(email);

            expect(user.id).to.not.be.undefined;
            expect(user.email).to.equal(email);

            // Verify user was persisted
            const persistedUser = await dataSource.getRepository(User).findOneBy({ email });
            expect(persistedUser).to.not.be.null;

            // Wait a moment for background job processing
            await new Promise((resolve) => setTimeout(resolve, 350));

            // Verify console log outputs from the background welcome processor
            expect(consoleSpy.calledWithMatch(/Sending welcome email to: demotask@test.com/)).to.be.true;
            expect(consoleSpy.calledWithMatch(/Welcome email successfully sent to: demotask@test.com/)).to.be.true;
        });
    });
});
