import { SampleService } from '../../services/';
import { Request, Response } from 'express';

export class SampleController {
    public constructor() { }

    public getSample(request: Request, response: Response): void {
        const sampleService = new SampleService();
        const result = sampleService.getSampleResponse();
        response.status(200).send({
            response: result
        });
    }
}