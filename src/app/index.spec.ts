import { expect } from 'chai';
import sinon from 'sinon';
import { App } from '.';

describe('App', function () {
    let appInstance: App;

    beforeEach(() => {
        appInstance = new App();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should create an instance', function () {
        expect(appInstance).to.be.an.instanceOf(App);
    });

    it('should start server on specified port', function (done) {
        const logSpy = sinon.spy(console, 'log');
        const server = appInstance.listen();

        setTimeout(() => {
            expect(logSpy.calledWithMatch(/Application running on url 📡:/)).to
                .be.true;
            expect(
                logSpy.calledWithMatch(/Api documentation running on url 📡:/)
            ).to.be.true;
            server.close();
            done();
        }, 50);
    });
});
