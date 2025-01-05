import { AppRouter } from './app-router';
import { AppController, AuthController } from '../controllers';
import { AppService } from '../services';
import { SampleRouter } from './sample-router';
import { SampleController } from '../controllers/sample/sample-contoller';
import { RootRouter } from './root-router';
import { AuthRouter } from './auth';
import { AuthService } from '../services/auth/auth-service';
import { userRepository } from '../models/repositories/UserRepository';

export const route = new RootRouter(
    new AuthRouter(new AuthController(new AuthService(userRepository))),
    new SampleRouter(new SampleController()),
    new AppRouter(new AppController(new AppService()))
);
