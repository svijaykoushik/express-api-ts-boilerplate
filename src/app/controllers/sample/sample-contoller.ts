import { SampleService } from '../../services/sample/sample-service';
import { Request, Response } from 'express';
import { APIError } from '../../error/api-error';

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
}
