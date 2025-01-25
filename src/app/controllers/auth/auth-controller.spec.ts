import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { GrantTypes } from '../../enums';
import { ApiException, ExceptionDetails } from '../../error/api-exception';
import { UnhandledException } from '../../error/unhandled-exception';
import { ApiResponse } from '../../helpers/api-response';
import { AuthController } from './auth-controller';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AuthController', () => {
    let authController;
    let authServiceStub;
    let req;
    let res;
    let next;

    beforeEach(() => {
        authServiceStub = {
            registerWithEmailAndPassword: sinon.stub(),
            generateAccessToken: sinon.stub(),
            generateRefreshToken: sinon.stub(),
            signInWithEmailAndPassword: sinon.stub(),
            verifyTokenAndGetPayload: sinon.stub(),
            getUserInfo: sinon.stub()
        };

        authController = new AuthController(authServiceStub);

        req = {
            body: {},
            userinfo: {}
        };

        res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub()
        };

        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('registerWithEmailAndPassword', () => {
        it('should register a user and return tokens', async () => {
            req.body = { email: 'test@test.com', password: 'password' };
            const user = { id: '123', email: 'test@test.com' };
            const accessToken = 'access-token';
            const refreshToken = 'refresh-token';

            authServiceStub.registerWithEmailAndPassword.resolves(user);
            authServiceStub.generateAccessToken.resolves(accessToken);
            authServiceStub.generateRefreshToken.resolves(refreshToken);

            await authController.registerWithEmailAndPassword(req, res, next);

            expect(res.status.calledOnceWith(201)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(res.send.firstCall.args[0]).to.deep.equal(
                new ApiResponse(201, {
                    userinfo: { email: user.email, id: user.id },
                    access_token: accessToken,
                    token_type: 'bearer',
                    refresh_token: refreshToken
                })
            );
        });

        it('should call next with ApiException if registration fails', async () => {
            req.body = { email: 'test@test.com', password: 'password' };
            const error = new ApiException(
                409,
                new ExceptionDetails('user-exists', 'User exists')
            );

            authServiceStub.registerWithEmailAndPassword.rejects(error);

            await authController.registerWithEmailAndPassword(req, res, next);

            expect(next.calledOnceWith(error)).to.be.true;
        });

        it('should call next with UnhandledException for unknown errors', async () => {
            req.body = { email: 'test@test.com', password: 'password' };
            const error = new Error('Unexpected error');

            authServiceStub.registerWithEmailAndPassword.rejects(error);

            await authController.registerWithEmailAndPassword(req, res, next);

            expect(next.calledOnce).to.be.true;
            expect(next.firstCall.args[0]).to.be.instanceOf(UnhandledException);
        });
    });

    describe('authenticate', () => {
        it('should handle password grant type and return tokens', async () => {
            req.body = {
                grant_type: GrantTypes.Password,
                email: 'test@test.com',
                password: 'password'
            };
            const user = { id: '123', email: 'test@test.com' };
            const accessToken = 'access-token';
            const refreshToken = 'refresh-token';

            authServiceStub.signInWithEmailAndPassword.resolves(user);
            authServiceStub.generateAccessToken.resolves(accessToken);
            authServiceStub.generateRefreshToken.resolves(refreshToken);

            await authController.authenticate(req, res, next);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(res.send.firstCall.args[0]).to.deep.equal(
                new ApiResponse(200, {
                    userinfo: { email: user.email, id: user.id },
                    access_token: accessToken,
                    expires_in: 3600,
                    token_type: 'bearer',
                    refresh_token: refreshToken
                })
            );
        });

        it('should handle refresh token grant type and return new access token', async () => {
            req.body = {
                grant_type: GrantTypes.RefreshToken,
                refresh_token: 'refresh-token'
            };
            const scope = 'read write profile';
            const userinfo = { id: '123', email: 'test@test.com' };
            const nextAccessToken = 'new-access-token';

            authServiceStub.verifyTokenAndGetPayload.resolves({
                scope,
                userinfo
            });
            authServiceStub.getUserInfo.resolves(userinfo);
            authServiceStub.generateAccessToken.resolves(nextAccessToken);

            await authController.authenticate(req, res, next);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(res.send.firstCall.args[0]).to.deep.equal(
                new ApiResponse(200, {
                    access_token: nextAccessToken,
                    token_type: 'bearer',
                    expires_in: 3600
                })
            );
        });

        it('should call next with ApiException for invalid grant type', async () => {
            req.body = { grant_type: 'invalid_grant' };

            await authController.authenticate(req, res, next);

            expect(next.calledOnce).to.be.true;
            const error = next.firstCall.args[0];
            expect(error).to.be.instanceOf(ApiException);
            expect(error.httpCode).to.equal(400);
        });
    });

    describe('getUserInfo', () => {
        it('should return user info for a valid user', async () => {
            req.userinfo = { id: '123' };
            const userinfo = { id: '123', email: 'test@test.com' };

            authServiceStub.getUserInfo.resolves(userinfo);

            await authController.getUserInfo(req, res, next);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(res.send.firstCall.args[0]).to.deep.equal(
                new ApiResponse(200, userinfo)
            );
        });

        it('should call next with ApiException if user not found', async () => {
            req.userinfo = { id: '123' };
            const error = new ApiException(
                404,
                new ExceptionDetails('user-not-found', 'User not found')
            );

            authServiceStub.getUserInfo.rejects(error);

            await authController.getUserInfo(req, res, next);

            expect(next.calledOnceWith(error)).to.be.true;
        });
    });
});
