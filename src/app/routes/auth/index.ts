import {
    Router,
    Request,
    Response,
    NextFunction,
    RequestHandler
} from 'express';
import { ApiRouter } from '../api-router';
import { ApiResponse } from '../../helpers/api-response';

export class AuthRouter implements ApiRouter {
    public readonly baseUrl = '/auth';

    private router: Router;

    public constructor() {
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
        this.router.post('/register', ((
            req: Request,
            res: Response,
            next: NextFunction
        ) => {
            // [TODO] implement singup
            res.status(501).send(
                new ApiResponse(501, null, 'Method not implemented')
            );
        }) as RequestHandler);

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
        this.router.post('/token', ((
            req: Request,
            res: Response,
            next: NextFunction
        ) => {
            // [TODO] implement token issue
            res.status(501).send(
                new ApiResponse(501, null, 'Method not implemented')
            );
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
         *       - bearerAuth: []
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
    }
}
