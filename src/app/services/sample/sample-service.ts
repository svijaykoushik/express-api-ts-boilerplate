import { runInTransaction } from '../../helpers/transaction';
import { queueService } from '../queue/in-memory-queue-service';
import { User } from '../../models/entities/User';
import { hash } from 'bcrypt';

export class SampleService {
    public getSampleResponse(): string {
        return 'Hello there!';
    }

    public async createSampleUserAndQueueJob(email: string): Promise<User> {
        try {
            // Register welcome-email background job processor
            queueService.process('welcome-email', async (data: { email: string }) => {
                console.log(`✉️ [Background Worker] Sending welcome email to: ${data.email}`);
                // Simulate email delivery latency
                await new Promise((resolve) => setTimeout(resolve, 300));
                console.log(`✅ [Background Worker] Welcome email successfully sent to: ${data.email}`);
            });
        } catch (e) {
            // Silence duplicate processor registration errors
        }

        return await runInTransaction(async (entityManager) => {
            const user = new User();
            user.email = email;
            user.password = await hash('sampleTempPassword123', 10);

            const savedUser = await entityManager.save(user);

            // Trigger background job
            await queueService.add('welcome-email', { email: savedUser.email });

            return savedUser;
        });
    }
}

