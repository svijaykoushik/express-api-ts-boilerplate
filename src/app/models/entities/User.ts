import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Unique('UQ_email', ['email'])
@Entity()
export class User {
    @PrimaryColumn('text', { name: 'id' })
    id: string;

    @Column('text', { name: 'email' })
    email: string;

    @Column('text', { name: 'password' })
    password: string;
}
