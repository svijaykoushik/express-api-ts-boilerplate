import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    OneToMany,
    PrimaryColumn,
    Unique,
    UpdateDateColumn
} from 'typeorm';
import { RefreshToken } from './RefreshToken';

@Unique('UQ_email', ['email'])
@Entity('user')
export class User {
    @PrimaryColumn('text', { name: 'id' })
    @Generated('uuid')
    id: string;

    @Column('text', { name: 'email' })
    email: string;

    @Column('text', { name: 'password' })
    password: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
    refreshTokens: RefreshToken[];
}
