import { expect } from 'chai';
import sinon from 'sinon';
import { InMemoryQueueService } from './in-memory-queue-service';

describe('InMemoryQueueService', function () {
    let queueServiceInstance: InMemoryQueueService;

    beforeEach(() => {
        queueServiceInstance = new InMemoryQueueService();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should process job asynchronously and call the registered processor', function (done) {
        const jobName = 'async-test-job';
        const jobData = { message: 'hello' };
        let processed = false;

        queueServiceInstance.process(jobName, async (data) => {
            expect(data).to.deep.equal(jobData);
            processed = true;
            done();
        });

        queueServiceInstance.add(jobName, jobData).then(() => {
            // Confirm it processes asynchronously (not immediately during the synchronous add execution)
            expect(processed).to.be.false;
        });
    });

    it('should handle processor errors gracefully without throwing to the event loop', function (done) {
        const jobName = 'error-test-job';
        const errorConsoleSpy = sinon.spy(console, 'error');

        queueServiceInstance.process(jobName, async () => {
            throw new Error('Processor Failure Error');
        });

        queueServiceInstance.add(jobName, {}).then(() => {
            setTimeout(() => {
                expect(errorConsoleSpy.called).to.be.true;
                expect(errorConsoleSpy.firstCall.args[0]).to.contain('Error processing background job');
                done();
            }, 50);
        });
    });

    it('should throw an error when registering multiple processors for the same job', function () {
        const jobName = 'duplicate-processor-job';
        
        queueServiceInstance.process(jobName, async () => {});
        
        expect(() => {
            queueServiceInstance.process(jobName, async () => {});
        }).to.throw('Processor already registered for job');
    });
});
