import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm';
import { User } from './User';

@Entity('refresh_token')
export class RefreshToken {
    @PrimaryColumn('text', { name: 'user_id' })
    userId: string;

    @PrimaryColumn('text', { name: 'refresh_token' })
    refreshToken: string;

    @Column('text', { name: 'expires_at' })
    expiresAt: Date;

    @Column('boolean', { name: 'is_revoked', default: false })
    isRevoked: boolean;

    @CreateDateColumn({ name: 'issued_at' })
    issuedAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.refreshTokens)
    @JoinColumn({
        name: 'user_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'user_refresh_token_fk'
    })
    user: User;
}
