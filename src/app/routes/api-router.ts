import { Router } from 'express';

export interface ApiRouter {
    readonly Router: Router;
    readonly baseUrl: string;
}
