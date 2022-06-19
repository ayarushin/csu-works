import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'Users' })
@Unique('user_email_unique_constraint', ['email'])
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 16, name: 'first_name' })
  firstName: string;

  @Column({ length: 16, name: 'last_name' })
  lastName: string;

  @Column({ length: 32, unique: true })
  email: string;

  @Column()
  gender: string;

  @Column({ name: 'ip_address' })
  ipAddress: string;
}
