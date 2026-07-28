/* eslint-disable @typescript-eslint/unbound-method */
import { Router } from 'express';
import { SampleController } from 'src/app/controllers/sample/sample-contoller';
import { ApiRouter } from '../helpers/api-router';

export class SampleRouter implements ApiRouter {
    public readonly baseUrl = '/sample';
    private router: Router;
    public constructor(private sampleController: SampleController) {
        this.router = Router();
        this.initRoutes();
    }

    public get Router(): Router {
        return this.router;
    }

    private initRoutes(): void {
        /**
         * @openapi
         * /sample:
         *   get:
         *     summary: The sample endpoint
         *     description: The sample endpoint
         *     tags:
         *       - Sample
         *     responses:
         *       200:
         *         description: Application works
         */
        this.router.get('/', this.sampleController.getSample);

        /**
         * @openapi
         * /sample/error:
         *   get:
         *     summary: The sample endpoint for error response
         *     description: The sample endpoint that gives error response
         *     tags:
         *       - Sample
         *     responses:
         *       500:
         *         description: Internal server error
         */
        this.router.get('/error', this.sampleController.getError);

        /**
         * @openapi
         * /sample/action:
         *   post:
         *     summary: Run a transactional background action demo
         *     description: Demonstrates running database transactions and background job queueing.
         *     tags:
         *       - Sample
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
         *                 example: demo-worker@test.com
         *     responses:
         *       202:
         *         description: Action accepted and job queued in background
         *       400:
         *         description: Bad Request
         */
        this.router.post('/action', (async (req, res, next) => {
            await this.sampleController.runDemoAction(req, res, next);
        }) as any);
    }
}

