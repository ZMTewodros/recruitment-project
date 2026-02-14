import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Application } from '../../applications/entities/application.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column()
  location: string;

  @Column({ type: 'decimal', nullable: true })
  salary: number;

  @Column({ type: 'timestamp' })
  deadline: Date;

  @Column({ default: 'open' })
  status: string;

  @CreateDateColumn()
  posted_at: Date;

  @ManyToOne(() => Company, (company) => company.jobs, { onDelete: 'CASCADE' })
  company: Company;

  @OneToMany(() => Application, (app) => app.job)
  applications: Application[];
}
