export interface QueueJob<T = any> {
    name: string;
    data: T;
}

export type JobProcessor<T = any> = (data: T) => Promise<void>;

export interface IQueueService {
    /**
     * Adds a job to the queue.
     */
    add<T = any>(name: string, data: T): Promise<void>;

    /**
     * Registers a processor function for a specific job name.
     */
    process<T = any>(name: string, processor: JobProcessor<T>): void;
}
