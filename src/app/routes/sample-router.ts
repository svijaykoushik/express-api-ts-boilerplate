/* eslint-disable @typescript-eslint/unbound-method */
import { Router } from 'express';
import { SampleController } from 'src/app/controllers/sample/sample-contoller';
import { ApiRouter } from './api-router';

export class SampleRouter implements ApiRouter {
    private router: Router;
    public constructor(
        private sampleController: SampleController
    ) {
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.get('/sample', this.sampleController.getSample);
        this.router.get('/sample/error', this.sampleController.getError);
    }

    public get Router(): Router {
        return this.router;
    }

}