import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users') // This tells PostgreSQL to create a table named 'users'
export class User {
  @PrimaryGeneratedColumn() // Auto-incrementing ID (1, 2, 3...)
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true }) // No two users can have the same email
  email: string;

  @Column()
  password: string; // We will hash this later for security

  @Column({
    type: 'enum',
    enum: ['jobseeker', 'employer', 'admin'],
    default: 'jobseeker',
  })
  role: string;

  @CreateDateColumn() // Automatically records when the user registered
  createdAt: Date;
}
