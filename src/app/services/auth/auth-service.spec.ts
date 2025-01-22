import bcrypt from 'bcrypt';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';
import { ApiException } from '../../error/api-exception';
import { AuthService } from './auth-service';

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('AuthService', () => {
    let authService;
    let userRepositoryStub;
    let refreshTokenRepositoryStub;

    beforeEach(() => {
        userRepositoryStub = {
            findOneByEmail: sinon.stub(),
            saveUser: sinon.stub(),
            findOneBy: sinon.stub()
        };
        refreshTokenRepositoryStub = {
            saveRefreshToken: sinon.stub()
        };
        authService = new AuthService(
            userRepositoryStub,
            refreshTokenRepositoryStub
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('registerWithEmailAndPassword', () => {
        it('should throw an error if the user already exists', async () => {
            userRepositoryStub.findOneByEmail.resolves({
                email: 'test@test.com'
            });

            await expect(
                authService.registerWithEmailAndPassword(
                    'test@test.com',
                    'password'
                )
            )
                .to.be.rejectedWith(ApiException);

            expect(
                userRepositoryStub.findOneByEmail.calledOnceWith(
                    'test@test.com'
                )
            ).to.be.true;
        });

        it('should save a new user if the email is not taken', async () => {
            userRepositoryStub.findOneByEmail.resolves(null);
            userRepositoryStub.saveUser.resolves({
                id: '123',
                email: 'test@test.com'
            });

            const user = await authService.registerWithEmailAndPassword(
                'test@test.com',
                'password'
            );

            expect(user).to.deep.equal({ id: '123', email: 'test@test.com' });
            expect(userRepositoryStub.saveUser.calledOnce).to.be.true;
        });
    });

    describe('signInWithEmailAndPassword', () => {
        it('should throw an error if the user does not exist', async () => {
            userRepositoryStub.findOneByEmail.resolves(null);

            await expect(
                authService.signInWithEmailAndPassword(
                    'test@test.com',
                    'password'
                )
            )
                .to.be.rejectedWith(ApiException);

            expect(
                userRepositoryStub.findOneByEmail.calledOnceWith(
                    'test@test.com'
                )
            ).to.be.true;
        });

        it('should throw an error if the password is incorrect', async () => {
            userRepositoryStub.findOneByEmail.resolves({
                password: await bcrypt.hash('wrongpassword', 10)
            });
            sinon.stub(bcrypt, 'compare').resolves(false);

            await expect(
                authService.signInWithEmailAndPassword(
                    'test@test.com',
                    'password'
                )
            )
                .to.be.rejectedWith(ApiException);
        });

        it('should return the user if credentials are correct', async () => {
            const user = {
                id: '123',
                email: 'test@test.com',
                password: await bcrypt.hash('password', 10)
            };
            userRepositoryStub.findOneByEmail.resolves(user);
            sinon.stub(bcrypt, 'compare').resolves(true);

            const result = await authService.signInWithEmailAndPassword(
                'test@test.com',
                'password'
            );

            expect(result).to.deep.equal(user);
        });
    });

    describe('generateAccessToken', () => {
        it('should generate a valid JWT token', async () => {
            const userinfo = { id: '123', email: 'test@test.com' };
            const signStub = sinon.stub(jwt, 'sign').yields(null, 'token');

            const token = await authService.generateAccessToken(userinfo);

            expect(token).to.equal('token');
            expect(signStub.calledOnce).to.be.true;
        });

        it('should throw an error if JWT signing fails', async () => {
            const userinfo = { id: '123', email: 'test@test.com' };
            const signStub = sinon
                .stub(jwt, 'sign')
                .yields(new Error('JWT error'));

            await expect(
                authService.generateAccessToken(userinfo)
            ).to.be.rejectedWith('JWT error');
        });
    });

    describe('generateRefreshToken', () => {
        it('should save and return a refresh token', async () => {
            const userinfo = { id: '123' };
            sinon.stub(jwt, 'sign').yields(null, jwt);
            refreshTokenRepositoryStub.saveRefreshToken.resolves({
                refreshToken: jwt
            });

            const token = await authService.generateRefreshToken(userinfo);

            expect(token).to.equal(jwt);
            expect(refreshTokenRepositoryStub.saveRefreshToken.calledOnce).to.be
                .true;
        });
    });

    describe('verifyTokenAndGetPayload', () => {
        it('should return decoded payload if token is valid', async () => {
            const payload = {
                scope: 'read write profile',
                userinfo: { id: '123', email: 'test@test.com' }
            };
            sinon.stub(jwt, 'verify').yields(null, payload);

            const result = await authService.verifyTokenAndGetPayload(
                'token',
                'secret'
            );

            expect(result).to.deep.equal(payload);
        });

        it('should throw an ApiException if token is expired', async () => {
            const error = new jwt.TokenExpiredError('expired', new Date());
            sinon.stub(jwt, 'verify').yields(error);

            await expect(
                authService.verifyTokenAndGetPayload('token', 'secret')
            ).to.be.rejectedWith(ApiException);
        });
    });

    describe('getUserInfo', () => {
        it('should return user info for a valid email', async () => {
            const userinfo = { id: '123', email: 'test@test.com' };
            userRepositoryStub.findOneByEmail.resolves(userinfo);

            const result = await authService.getUserInfo('test@test.com');

            expect(result).to.deep.equal(userinfo);
        });

        it('should throw an ApiException if user is not found', async () => {
            userRepositoryStub.findOneByEmail.resolves(null);

            await expect(authService.getUserInfo('test@test.com'))
                .to.be.rejectedWith(ApiException);
        });
    });
});
