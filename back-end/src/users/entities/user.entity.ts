import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Application } from '../../applications/entities/applications.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: true })
  isActive: boolean;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  isEmailVerified: boolean; // Indicates if the email is verified

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string | null;

  @Column({ select: false }) // Security: prevents password from being returned in standard queries
  password: string;

  @Column({
    type: 'enum',
    enum: ['jobseeker', 'employer', 'admin'],
    default: 'jobseeker',
  })
  role: string;
  @Column({ nullable: true })
  phone: string;
  @Column({ nullable: true }) location: string;
  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'json', nullable: true })
  experience: any[];

  @Column({ type: 'json', nullable: true })
  education: any[];

  @Column({ type: 'simple-array', nullable: true })
  skills: string[];

  @Column({ nullable: true })
  cv: string;
  // @Column({ type: 'varchar', nullable: true })
  // loginOtp: string | null;

  // @Column({ type: 'timestamp', nullable: true })
  // loginOtpExpiry: Date | null;
  @Column({ default: false })
  profileCompleted: boolean;
  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];
  @OneToOne(() => Company, (company) => company.user)
  company: Company;
}
