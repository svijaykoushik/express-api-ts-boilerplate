import { v4 } from 'uuid';
import getDataSource from '../../config/db-config';
import { User } from '../entities/User';
import { Repository } from 'typeorm';

export interface UserRepository {
    saveUser: (
        this: Repository<User>,
        userInfo: Pick<User, 'email' | 'password'>
    ) => Promise<User>;
}

export const userRepository = getDataSource()
    .getRepository(User)
    .extend<UserRepository>({
        async saveUser(
            this: Repository<User>,
            userInfo: Pick<User, 'email' | 'password'>
        ): Promise<User> {
            const user = await this.save(
                this.create({
                    id: v4(),
                    email: userInfo.email,
                    password: userInfo.password
                })
            );
            return user;
        }
    });
