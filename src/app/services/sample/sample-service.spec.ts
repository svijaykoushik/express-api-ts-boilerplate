import { SampleService } from './sample-service';
import { expect, assert } from 'chai';

describe('Sample service', () => {
    it('should create an instance', () => {
        const sampleService = new SampleService();
        expect(sampleService).to.be.instanceOf(SampleService);
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
    });
});
