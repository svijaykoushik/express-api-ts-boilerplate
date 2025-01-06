import { v4 } from 'uuid';
import getDataSource from '../../config/db-config';
import { User } from '../entities/User';
import { Repository } from 'typeorm';

export interface UserRepository {
    saveUser: (
        this: Repository<User>,
        userInfo: Pick<User, 'email' | 'password'>
    ) => Promise<User>;

    findOneByEmail: (this: Repository<User>, email: string) => Promise<User>;
}

export const userRepository = getDataSource()
    .getRepository(User)
    .extend<UserRepository>({
        async saveUser(
            this: Repository<User>,
            userInfo: Pick<User, 'email' | 'password'>
        ): Promise<User> {
            return await this.save(
                this.create({
                    id: v4(),
                    email: userInfo.email,
                    password: userInfo.password
                })
            );
        },
        async findOneByEmail(this: Repository<User>, email: string): Promise<User> {
            return await this.findOneBy({
                email
            });
        }
    });
