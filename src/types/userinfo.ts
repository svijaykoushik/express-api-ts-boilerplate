import { User } from '../app/models/entities/User';

export type UserInfo = Required<Pick<User, 'id'>> & Partial<User>;
