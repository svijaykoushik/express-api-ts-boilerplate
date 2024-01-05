import { AppService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../helpers/api-response';
import { ApiException } from '../error/api-exception';
import { UnhandledException } from '../error/unhandled-exception';

export class AppController {
    public constructor(private appService: AppService) {}

    public async sample(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const result = await this.appService.sample();
            response.status(200).send(
                new ApiResponse(
                    200,
                    {
                        data: result
                    },
                    'sample response'
                )
            );
        } catch (e) {
            if (e instanceof ApiException) {
                next(e);
            } else {
                next(new UnhandledException(e));
            }
        }
    }
}
