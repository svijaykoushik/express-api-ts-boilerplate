import { Repository } from 'typeorm';
import { User } from '../../models/entities/User';
import { UserRepository } from '../../models/repositories/UserRepository';
import { compare, hash } from 'bcrypt';
import { ApiException, ExceptionDetails } from '../../error/api-exception';

export class AuthService {
    public constructor(
        private userRepository: Repository<User> & UserRepository
    ) {}

    public async registerWithEmailAndPassword(email: string, password: string) {
        let user: User = await this.userRepository.findOneByEmail(email);
        if (user) {
            throw new ApiException(
                409,
                new ExceptionDetails('user_exists', 'User already exists')
            );
        }
        user = await this.userRepository.saveUser({
            email,
            password: await hash(password, 10)
        });

        return user;
    }

    public async signInWithEmailAndPassword(email: string, password: string) {
        const user: User = await this.userRepository.findOneByEmail(email);
        if (!user) {
            throw new ApiException(
                400,
                new ExceptionDetails(
                    'invalid_credentials',
                    'Invalid credentials'
                )
            );
        }

        if ((await compare(password, user.password)) === false) {
            throw new ApiException(
                400,
                new ExceptionDetails(
                    'invalid_credentials',
                    'Invalid credentials'
                )
            );
        }

        return user;
    }
}
