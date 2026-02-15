import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Application } from '../../applications/entities/applications.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  skills: string;

  @Column({ type: 'text', nullable: true })
  experience: string;

  @Column({ type: 'text', nullable: true })
  education: string;

  @Column({ nullable: true })
  cv: string;
  // @Column({ type: 'varchar', nullable: true })
  // loginOtp: string | null;

  // @Column({ type: 'timestamp', nullable: true })
  // loginOtpExpiry: Date | null;

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];

  @OneToMany(() => Company, (company) => company.user)
  companies: Company[];
}
