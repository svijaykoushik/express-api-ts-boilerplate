import { Router } from 'express';
import { ApiRouter } from './api-router';

export class RootRouter implements ApiRouter {
    private router: Router;

    public constructor() {
        this.router = Router();

        /**
         * @openapi
         * /:
         *   get:
         *     summary: The entry point of the application
         *     description: The entry poin of the application
         *     tags:
         *       - Entry Point
         *     responses:
         *       200:
         *         description: Ok
         */
        this.router.get('/', (request, response) => {
            response.status(200).send({
                message: 'Welcome'
            });
        });
    }

    public get Router(): Router {
        return this.router;
    }
}
