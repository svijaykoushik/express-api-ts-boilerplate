/* eslint-disable @typescript-eslint/unbound-method */
import {
    NextFunction,
    Router,
    Request,
    Response,
    RequestHandler
} from 'express';
import { AppController } from 'src/app/controllers/app-contoller';
import { ApiRouter } from '../helpers/api-router';

export class AppRouter implements ApiRouter {
    public readonly baseUrl = '/api/v1/app';
    private router: Router;
    public constructor(private appController: AppController) {
        this.router = Router();
        this.initRoutes();
    }

    public get Router(): Router {
        return this.router;
    }

    private initRoutes(): void {
        /**
         * @openapi
         * /api/v1/app/sample:
         *   get:
         *     summary: The sample endpoint of api
         *     description: The sample endpoint of api
         *     tags:
         *       - App
         *     responses:
         *       200:
         *         description: Application works
         */
        this.router.get('/sample', (async (
            req: Request,
            res: Response,
            next: NextFunction
        ) => {
            await this.appController.sample(req, res, next);
        }) as RequestHandler);
    }
}
