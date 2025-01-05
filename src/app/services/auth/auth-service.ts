import { Repository } from 'typeorm';
import { User } from '../../models/entities/User';
import { UserRepository } from '../../models/repositories/UserRepository';
import { hash } from 'bcrypt';

export class AuthService {
    public constructor(
        private userRepository: Repository<User> & UserRepository
    ) {}

    public async registerWithEmailAndPassword(email: string, password: string) {
        const user = await this.userRepository.saveUser({
            email,
            password: await hash(password, 10)
        });

        return user;
    }
}
