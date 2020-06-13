import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import { AddressInfo } from 'net';
import { Server } from 'http';
import { routes } from './routes';
import { ErrorHandlerMiddleware } from './middlewares';
export class App {
    private app: express.Express;
    private errorHandlerMiddleware: ErrorHandlerMiddleware;
    public constructor() {
        this.app = express();
        this.errorHandlerMiddleware = new ErrorHandlerMiddleware();
        this.init();
        this.initRoutes();
        this.initErrorMiddlewares();
    }

    public listen(): Server {
        const server = this.app.listen(3000, 'localhost', () => {
            const address = (server.address() as AddressInfo).address;
            const port = (server.address() as AddressInfo).port;
            console.log(`Application running on url 📡: ${address}:${port}/`);
        });
        return server;
    }

    private init() {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(bodyParser.json({ limit: '50mb' }));
    }

    private initRoutes() {
        routes.forEach((route) => {
            this.app.use(route.Router);
        });
        this.app.use((request: Request, response: Response, next: NextFunction) => {
            this.errorHandlerMiddleware.routeErrorHandler(request, response, next);
        });
    }

    private initErrorMiddlewares() {
        this.app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
            this.errorHandlerMiddleware.unhandledErrorHandler(error, request, response, next);
        });
    }

}