import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn('text', { name: 'id' })
    id: string;

    @Unique('UQ_email', ['email'])
    @Column('text', { name: 'email' })
    email: string;

    @Column('text', { name: 'password' })
    password: string;
}
