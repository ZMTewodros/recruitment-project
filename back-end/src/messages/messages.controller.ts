// src/messages/messages.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessagesService } from '../messages/messages.service';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  sendMessage(
    @Req() req,
    @Body() body: { content: string; receiverId: number },
  ) {
    return this.messagesService.create(
      req.user.userId,
      body.receiverId,
      body.content,
    );
  }

  @Get(':otherUserId')
  getChat(@Req() req, @Param('otherUserId') otherUserId: string) {
    return this.messagesService.getConversation(req.user.userId, +otherUserId);
  }
}
