import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Application } from '../../applications/entities/applications.entity';

export enum JobStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  category: string;

  @Column()
  location: string;

  @Column('int')
  salary: number;

  @Column({ type: 'date' })
  deadline: Date;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.OPEN, // Changed to OPEN for immediate visibility
  })
  status: JobStatus;

  @ManyToOne(() => Company, (company) => company.jobs, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];

  @CreateDateColumn()
  createdAt: Date;
}
