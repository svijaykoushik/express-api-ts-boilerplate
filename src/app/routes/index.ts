import { AppRouter } from './app-router';
import { AppController } from '../controllers';
import { AppService } from '../services';

export const routes = [
    new AppRouter(new AppController(new AppService()))
];