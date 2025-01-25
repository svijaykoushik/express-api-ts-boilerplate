import { Request, Response, NextFunction } from 'express';
import { expect } from 'chai';
import sinon from 'sinon';
import { AuthorizationMiddleware } from './authorization-middleware';
import { AuthService } from '../services/auth/auth-service';
import { ApiException, ExceptionDetails } from '../error/api-exception';
import { Scope } from '../../types/scope';
import { UnhandledException } from '../error/unhandled-exception';

describe('AuthorizationMiddleware', () => {
    let authServiceStub: sinon.SinonStubbedInstance<AuthService>;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: sinon.SinonStub;

    beforeEach(() => {
        authServiceStub = sinon.createStubInstance(AuthService);
        req = { headers: {} };
        res = {};
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should call next with an ApiException if no token is provided', async () => {
        const middleware = AuthorizationMiddleware(authServiceStub);

        await middleware(req as Request, res as Response, next);

        expect(next.calledOnce).to.be.true;
        const error = next.getCall(0).args[0];
        expect(error).to.be.instanceOf(ApiException);
        expect((error as ApiException).httpCode).to.equal(401);
        expect(error.details.error_code).to.equal('invalid_grant');
        expect(error.details.error_description).to.equal(
            'Token missing. Access token is required to serve this request'
        );
    });

    it('should call next with an ApiException if the token is invalid', async () => {
        req.headers.authorization = 'Bearer invalid_token';
        authServiceStub.verifyTokenAndGetPayload.rejects(
            new ApiException(
                401,
                new ExceptionDetails(
                    'invalid_grant',
                    'Invalid or expired token.'
                )
            )
        );
        const middleware = AuthorizationMiddleware(authServiceStub);

        await middleware(req as Request, res as Response, next);

        expect(next.calledOnce).to.be.true;
        const error = next.getCall(0).args[0];
        expect(error).to.be.instanceOf(ApiException);
        expect((error as ApiException).httpCode).to.equal(401);
        expect((error as ApiException).details.error_description).to.equal(
            'Invalid or expired token.'
        );
    });

    it('should call next with an ApiException if the required scope is missing', async () => {
        req.headers.authorization = 'Bearer valid_token';
        authServiceStub.verifyTokenAndGetPayload.resolves({
            scope: 'read write',
            userinfo: { id: '123', email: 'test@test.com' }
        });
        const middleware = AuthorizationMiddleware(authServiceStub, [
            Scope.PROFILE
        ]);

        await middleware(req as Request, res as Response, next);

        expect(next.calledOnce).to.be.true;
        const error = next.getCall(0).args[0];
        expect(error).to.be.instanceOf(ApiException);
        expect((error as ApiException).httpCode).to.equal(403);
        expect((error as ApiException).details.error_description).to.equal(
            'Invalid scope. Access denied.'
        );
    });

    it('should attach userinfo to the request and call next if the token is valid and scope matches', async () => {
        req.headers.authorization = 'Bearer valid_token';
        authServiceStub.verifyTokenAndGetPayload.resolves({
            scope: 'read write profile',
            userinfo: { id: '123', email: 'test@test.com' }
        });
        const middleware = AuthorizationMiddleware(authServiceStub, [
            Scope.READ,
            Scope.WRITE,
            Scope.PROFILE
        ]);

        await middleware(req as Request, res as Response, next);

        expect(next.calledOnce).to.be.true;
        expect(next.getCall(0).args).to.be.empty; // next should not be called with an error
        expect(req['userinfo']).to.deep.equal({
            id: '123',
            email: 'test@test.com'
        });
    });

    it('should call next with an UnhandledException for unexpected errors', async () => {
        req.headers.authorization = 'Bearer valid_token';
        authServiceStub.verifyTokenAndGetPayload.rejects(
            new Error('Unexpected error')
        );
        const middleware = AuthorizationMiddleware(authServiceStub);

        await middleware(req as Request, res as Response, next);

        expect(next.calledOnce).to.be.true;
        const error = next.getCall(0).args[0];
        expect(error).to.be.instanceOf(UnhandledException);
        expect((error as UnhandledException).message).to.equal(
            'Something broke!'
        );
    });
});
