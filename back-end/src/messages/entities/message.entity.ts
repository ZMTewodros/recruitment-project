// src/messages/entities/message.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User)
  sender: User;

  @Column()
  senderId: number;

  @ManyToOne(() => User)
  receiver: User;

  @Column()
  receiverId: number;

  @CreateDateColumn()
  createdAt: Date;
}
