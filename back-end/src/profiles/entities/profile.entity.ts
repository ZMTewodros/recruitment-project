import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column('text', { array: true, nullable: true }) // Storing skills as an array
  skills: string[];

  @Column('text', { nullable: true })
  experience: string;

  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true })
  cv_url: string; // Path to the uploaded file

  // Linking to User
  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // This creates the user_id column in the DB
  user: User;
}
