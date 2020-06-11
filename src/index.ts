import { App } from './app';

class Server {
    public static main(): void {
        const app = new App();
        app.listen();
    }
}

Server.main();
