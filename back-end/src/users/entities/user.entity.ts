import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { Company } from '../../companies/entities/company.entity';
import { Application } from '../../applications/entities/application.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Security: prevents password from being returned in standard queries
  password: string;

  @Column({
    type: 'enum',
    enum: ['jobseeker', 'employer', 'admin'],
    default: 'jobseeker',
  })
  role: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToOne(() => Company, (company) => company.user)
  company: Company;

  @OneToMany(() => Application, (app) => app.user)
  applications: Application[];
}
