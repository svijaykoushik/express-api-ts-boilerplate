/* eslint-disable @typescript-eslint/unbound-method */
import { NextFunction, Router, Request, Response } from 'express';
import { AppController } from 'src/app/controllers/app-contoller';
import { ApiRouter } from './api-router';

export class AppRouter implements ApiRouter {
    private router: Router;
    private baseUrl = '/api/v1/app';
    public constructor(
        private appController: AppController
    ) {
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.get(`${this.baseUrl}/sample`,
        (req: Request, res: Response, next: NextFunction) => {
            this.appController.sample(req, res, next);
        });
    }

    public get Router(): Router {
        return this.router;
    }

}