import { expect } from 'chai';
import { App } from '.';

describe('Application', function () {
    it('should create an instance', function () {
        const app = new App();
        expect(app).to.be.an.instanceOf(App);
    });
});