import { SampleRouter } from './sample-router';
import { SampleController } from '../controllers';

export const routes = [
    new SampleRouter(new SampleController())
];