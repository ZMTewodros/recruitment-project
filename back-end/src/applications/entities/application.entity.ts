import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Job } from '../../jobs/entities/job.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cv_file: string;

  @Column({ type: 'text', nullable: true })
  cover_letter: string;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  applied_at: Date;

  @ManyToOne(() => User, (user) => user.applications, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Job, (job) => job.applications, { onDelete: 'CASCADE' })
  job: Job;
}
