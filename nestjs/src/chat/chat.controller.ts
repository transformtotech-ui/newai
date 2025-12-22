import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Create a new conversation' })
  createConversation(
    @GetUser() user: User,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    return this.chatService.createConversation(user.id, createConversationDto);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get all user conversations' })
  getUserConversations(@GetUser() user: User) {
    return this.chatService.getUserConversations(user.id);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation by ID' })
  getConversation(@Param('id') id: string) {
    return this.chatService.getConversationById(id);
  }

  @Delete('conversations/:id')
  @ApiOperation({ summary: 'Delete a conversation' })
  deleteConversation(@GetUser() user: User, @Param('id') id: string) {
    return this.chatService.deleteConversation(user.id, id);
  }

  @Post('messages')
  @ApiOperation({ summary: 'Send a message' })
  sendMessage(@GetUser() user: User, @Body() createMessageDto: CreateMessageDto) {
    return this.chatService.sendMessage(user.id, createMessageDto);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get all messages in a conversation' })
  getConversationMessages(@GetUser() user: User, @Param('id') id: string) {
    return this.chatService.getConversationMessages(user.id, id);
  }

  @Patch('messages/:id/read')
  @ApiOperation({ summary: 'Mark message as read' })
  markMessageAsRead(@GetUser() user: User, @Param('id') id: string) {
    return this.chatService.markMessageAsRead(user.id, id);
  }
}
