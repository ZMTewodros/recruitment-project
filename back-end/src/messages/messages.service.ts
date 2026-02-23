// src/messages/messages.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  async create(senderId: number, receiverId: number, content: string) {
    const message = this.messageRepo.create({
      senderId,
      receiverId,
      content,
    });
    return this.messageRepo.save(message);
  }

  async getConversation(userId: number, otherUserId: number) {
    return this.messageRepo.find({
      where: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
      order: { createdAt: 'ASC' },
    });
  }
}
