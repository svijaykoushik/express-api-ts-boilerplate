import {
    NextFunction,
    Request,
    RequestHandler,
    Response,
    Router
} from 'express';
import { Scope } from '../../../types/scope';
import { AuthController } from '../../controllers';
import { RegisterDTO, TokenDTO } from '../../dtos';
import { ApiResponse } from '../../helpers/api-response';
import { ApiRouter } from '../../helpers/api-router';
import { BodyValidationMiddleware } from '../../middlewares';
import { AuthorizationMiddleware } from '../../middlewares/authorization-middleware';
import { refreshTokenRepository } from '../../models/repositories/RefreshTokenRepository';
import { userRepository } from '../../models/repositories/UserRepository';
import { AuthService } from '../../services/auth/auth-service';

export class AuthRouter implements ApiRouter {
    public readonly baseUrl = '/auth';

    private router: Router;

    public constructor(private authController: AuthController) {
        this.router = Router();
        this.initRoutes();
    }

    public get Router(): Router {
        return this.router;
    }

    private initRoutes(): void {
        /**
         * @openapi
         * /auth/register:
         *   post:
         *     summary: Register a new user
         *     description: This endpoint allows a new user to register by providing an email and password.
         *     tags:
         *       - Authentication
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               email:
         *                 type: string
         *                 format: email
         *                 description: The email address of the user.
         *                 example: user@example.com
         *               password:
         *                 type: string
         *                 format: password
         *                 description: The password for the user account.
         *                 example: StrongP@ssw0rd
         *     responses:
         *       201:
         *         description: User registered successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: User registered successfully.
         *                 accessToken:
         *                   type: string
         *                   description: The newly issued access token.
         *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *                 refreshToken:
         *                   type: string
         *                   description: The newly issued refresh token.
         *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       400:
         *         description: Bad request, invalid input.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 error:
         *                   type: string
         *                   example: Invalid email or password format.
         *       409:
         *         description: Conflict, email already exists.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 error:
         *                   type: string
         *                   example: Email already in use.
         *       500:
         *         description: Internal server error.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 error:
         *                   type: string
         *                   example: An unexpected error occurred.
         */
        this.router.post(
            '/register',
            BodyValidationMiddleware(RegisterDTO),
            (async (req: Request, res: Response, next: NextFunction) => {
                await this.authController.registerWithEmailAndPassword(
                    req,
                    res,
                    next
                );
            }) as RequestHandler
        );

        /**
         * @openapi
         * /auth/token:
         *   post:
         *     summary: Generate or refresh an access token
         *     description: This endpoint issues a new access token and refresh token based on the provided credentials or refresh token.
         *     tags:
         *       - Authentication
         *     requestBody:
         *       required: true
         *       content:
         *         application/x-www-form-urlencoded:
         *           schema:
         *             type: object
         *             properties:
         *               grant_type:
         *                 type: string
         *                 enum:
         *                   - password
         *                   - refresh_token
         *                 description: The type of grant being used. Must be either `password` or `refresh_token`.
         *                 example: password
         *               email:
         *                 type: string
         *                 format: email
         *                 description: The email address of the user. Required if `grant_type` is `password`.
         *                 example: user@example.com
         *               password:
         *                 type: string
         *                 format: password
         *                 description: The password for the user account. Required if `grant_type` is `password`.
         *                 example: StrongP@ssw0rd
         *               refresh_token:
         *                 type: string
         *                 description: The refresh token. Required if `grant_type` is `refresh_token`.
         *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *             required:
         *               - grant_type
         *     responses:
         *       200:
         *         description: Tokens generated successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 userinfo:
         *                   type: object
         *                   properties:
         *                     email:
         *                       type: string
         *                       format: email
         *                       description: The authenticated user's email.
         *                     id:
         *                       type: string
         *                       description: The authenticated user's id.
         *                   description: The authenticated userinfo.
         *                 access_token:
         *                   type: string
         *                   description: The newly issued access token.
         *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *                 refresh_token:
         *                   type: string
         *                   description: The newly issued refresh token.
         *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       400:
         *         description: Bad request, invalid input.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 error:
         *                   type: string
         *                   example: Invalid grant_type or missing required fields.
         *       401:
         *         description: Unauthorized, invalid credentials.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 error:
         *                   type: string
         *                   example: Invalid email or password.
         *       500:
         *         description: Internal server error.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 error:
         *                   type: string
         *                   example: An unexpected error occurred.
         */
        this.router.post('/token', BodyValidationMiddleware(TokenDTO), (async (
            req: Request,
            res: Response,
            next: NextFunction
        ) => {
            await this.authController.authenticate(req, res, next);
        }) as RequestHandler);

        /**
         * @openapi
         * /auth/logout:
         *   post:
         *     summary: Log out the user
         *     description: This endpoint logs out the user by invalidating the provided access token.
         *     tags:
         *       - Authentication
         *     security:
         *       - oAuth: [profile]
         *     responses:
         *       204:
         *         description: Successfully logged out. No content is returned.
         *       401:
         *         description: Unauthorized, invalid or missing token.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 error:
         *                   type: string
         *                   example: Invalid or missing authorization token.
         *       500:
         *         description: Internal server error.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 error:
         *                   type: string
         *                   example: An unexpected error occurred.
         */

        this.router.post('/logout', ((
            req: Request,
            res: Response,
            next: NextFunction
        ) => {
            // [TODO] implement logout
            res.status(501).send(
                new ApiResponse(501, null, 'Method not implemented')
            );
        }) as RequestHandler);

        /**
         * @swagger
         * /auth/userinfo:
         *   get:
         *     summary: Retrieve user information
         *     description: This endpoint retrieves user information based on the access token provided in the request.
         *     tags:
         *       - Authentication
         *     security:
         *       - oAuth: [profile]
         *     responses:
         *       200:
         *         description: User information retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status_code:
         *                   type: integer
         *                   description: HTTP status code indicating success.
         *                   example: 200
         *                 id:
         *                   type: string
         *                   description: The unique identifier for the user.
         *                   example: random-user-id
         *                 email:
         *                   type: string
         *                   format: email
         *                   description: The email address of the user.
         *                   example: user@example.com
         *       401:
         *         description: Unauthorized, invalid or missing token.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status_code:
         *                   type: integer
         *                   description: HTTP status code indicating error.
         *                   example: 401
         *                 error:
         *                   type: string
         *                   description: Error code.
         *                   example: invalid-token
         *                 error_description:
         *                   type: string
         *                   description: Detailed description of the error.
         *                   example: Authorization token is invalid or expired.
         *       404:
         *         description: User not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status_code:
         *                   type: integer
         *                   description: HTTP status code indicating error.
         *                   example: 404
         *                 error:
         *                   type: string
         *                   description: Error code.
         *                   example: resource-not-found
         *                 error_description:
         *                   type: string
         *                   description: Detailed description of the error.
         *                   example: User not found.
         *       500:
         *         description: Internal server error.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status_code:
         *                   type: integer
         *                   description: HTTP status code indicating error.
         *                   example: 500
         *                 error:
         *                   type: string
         *                   description: Error code.
         *                   example: internal-server-error
         *                 error_description:
         *                   type: string
         *                   description: Detailed description of the error.
         *                   example: An unexpected error occurred.
         */
        this.router.get(
            '/userinfo',
            AuthorizationMiddleware(
                new AuthService(userRepository, refreshTokenRepository),
                [Scope.PROFILE]
            ),
            (async (req: Request, res: Response, next: NextFunction) => {
                await this.authController.getUserInfo(req, res, next);
            }) as RequestHandler
        );
    }
}
