import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Resolver(() => Conversation)
@UseGuards(GqlAuthGuard)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(() => Conversation)
  async createConversation(
    @GetUser() user: User,
    @Args('input') createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    return this.chatService.createConversation(user.id, createConversationDto);
  }

  @Query(() => [Conversation])
  async myConversations(@GetUser() user: User): Promise<Conversation[]> {
    return this.chatService.getUserConversations(user.id);
  }

  @Query(() => Conversation)
  async conversation(@Args('id') id: string): Promise<Conversation> {
    return this.chatService.getConversationById(id);
  }

  @Mutation(() => Message)
  async sendMessage(
    @GetUser() user: User,
    @Args('input') createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    return this.chatService.sendMessage(user.id, createMessageDto);
  }

  @Query(() => [Message])
  async conversationMessages(
    @GetUser() user: User,
    @Args('conversationId') conversationId: string,
  ): Promise<Message[]> {
    return this.chatService.getConversationMessages(user.id, conversationId);
  }

  @Mutation(() => Message)
  async markMessageAsRead(
    @GetUser() user: User,
    @Args('messageId') messageId: string,
  ): Promise<Message> {
    return this.chatService.markMessageAsRead(user.id, messageId);
  }

  @Mutation(() => Boolean)
  async deleteConversation(
    @GetUser() user: User,
    @Args('conversationId') conversationId: string,
  ): Promise<boolean> {
    await this.chatService.deleteConversation(user.id, conversationId);
    return true;
  }
}
