import { EventEmitter } from 'events';
import { IQueueService, JobProcessor } from './queue-service.interface';

export class InMemoryQueueService implements IQueueService {
    private eventEmitter: EventEmitter;
    private processors: Map<string, JobProcessor>;

    public constructor() {
        this.eventEmitter = new EventEmitter();
        this.processors = new Map();
        this.init();
    }

    private init(): void {
        this.eventEmitter.on('job', (name: string, data: any) => {
            const processor = this.processors.get(name);
            if (!processor) {
                console.warn(`⚠️ No job processor registered for job: ${name}`);
                return;
            }

            // Execute the job asynchronously to not block the event loop
            setImmediate(async () => {
                try {
                    await processor(data);
                } catch (error) {
                    console.error(`❌ Error processing background job [${name}]:`, error);
                }
            });
        });
    }

    public async add<T = any>(name: string, data: T): Promise<void> {
        // Simulate immediate response of queue push
        this.eventEmitter.emit('job', name, data);
        return Promise.resolve();
    }

    public process<T = any>(name: string, processor: JobProcessor<T>): void {
        if (this.processors.has(name)) {
            throw new Error(`Processor already registered for job: ${name}`);
        }
        this.processors.set(name, processor);
    }
}

// Export a singleton instance by default
export const queueService = new InMemoryQueueService();
