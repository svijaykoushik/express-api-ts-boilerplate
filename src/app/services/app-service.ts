export class AppService {
    public async sample(): Promise<string> {
        try {
            return 'working';
        } catch (e) {
            throw e;
        }
    }
}
