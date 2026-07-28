import { SampleService } from '../../services/sample/sample-service';
import { NextFunction, Request, Response } from 'express';
import { APIError } from '../../error/api-error';
import { ApiResponse } from '../../helpers/api-response';

export class SampleController {
    public constructor() {}

    public getSample(request: Request, response: Response): void {
        const sampleService = new SampleService();
        const result = sampleService.getSampleResponse();
        response.status(200).send({
            response: result
        });
    }

    public getError(request: Request, response: Response): void {
        throw new APIError(500, 'SAMPLE_ERROR', 'This is a sample error');
    }

    public async runDemoAction(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email } = request.body;
            if (!email) {
                throw new APIError(
                    400,
                    'BAD_REQUEST',
                    'Email is required for the demo action'
                );
            }

            const sampleService = new SampleService();
            const user = await sampleService.createSampleUserAndQueueJob(email);

            response.status(202).send(
                new ApiResponse(202, {
                    user: {
                        id: user.id,
                        email: user.email
                    },
                    status: 'accepted',
                    message:
                        'Demo action executed successfully. Welcome email job queued in background.'
                })
            );
        } catch (error) {
            next(error);
        }
    }
}

