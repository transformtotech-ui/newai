import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { User } from '../user/entities/user.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createConversation(
    userId: string,
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const { participantId } = createConversationDto;

    if (userId === participantId) {
      throw new BadRequestException('Cannot create conversation with yourself');
    }

    // Check if user exists
    const participant = await this.userRepository.findOne({
      where: { id: participantId },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    // Check if conversation already exists
    const existingConversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin('conversation.participants', 'user1', 'user1.id = :userId', {
        userId,
      })
      .innerJoin(
        'conversation.participants',
        'user2',
        'user2.id = :participantId',
        { participantId },
      )
      .getOne();

    if (existingConversation) {
      return this.getConversationById(existingConversation.id);
    }

    // Create new conversation
    const currentUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    const conversation = this.conversationRepository.create({
      participants: [currentUser, participant],
    });

    return this.conversationRepository.save(conversation);
  }

  async getConversationById(id: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: ['participants', 'messages', 'messages.sender'],
      order: { messages: { createdAt: 'DESC' } },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoinAndSelect('conversation.participants', 'participant')
      .leftJoinAndSelect('conversation.messages', 'message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('participant.id = :userId', { userId })
      .orderBy('conversation.updatedAt', 'DESC')
      .addOrderBy('message.createdAt', 'DESC')
      .getMany();

    return conversations;
  }

  async sendMessage(
    userId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const { content, attachmentUrl, conversationId, groupChatId } =
      createMessageDto;

    if (!conversationId && !groupChatId) {
      throw new BadRequestException(
        'Either conversationId or groupChatId must be provided',
      );
    }

    if (conversationId && groupChatId) {
      throw new BadRequestException(
        'Cannot send message to both conversation and group chat',
      );
    }

    // Verify user is part of the conversation
    if (conversationId) {
      const conversation = await this.conversationRepository
        .createQueryBuilder('conversation')
        .innerJoin('conversation.participants', 'participant')
        .where('conversation.id = :conversationId', { conversationId })
        .andWhere('participant.id = :userId', { userId })
        .getOne();

      if (!conversation) {
        throw new ForbiddenException(
          'You are not a participant of this conversation',
        );
      }
    }

    const message = this.messageRepository.create({
      content,
      attachmentUrl,
      senderId: userId,
      conversationId,
      groupChatId,
      isRead: false,
    });

    const savedMessage = await this.messageRepository.save(message);

    // Update conversation timestamp
    if (conversationId) {
      await this.conversationRepository.update(conversationId, {
        updatedAt: new Date(),
      });
    }

    return this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['sender', 'conversation', 'groupChat'],
    });
  }

  async getConversationMessages(
    userId: string,
    conversationId: string,
  ): Promise<Message[]> {
    // Verify user is part of the conversation
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin('conversation.participants', 'participant')
      .where('conversation.id = :conversationId', { conversationId })
      .andWhere('participant.id = :userId', { userId })
      .getOne();

    if (!conversation) {
      throw new ForbiddenException(
        'You are not a participant of this conversation',
      );
    }

    return this.messageRepository.find({
      where: { conversationId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async markMessageAsRead(
    userId: string,
    messageId: string,
  ): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['sender', 'conversation', 'conversation.participants'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check if user is a participant
    const isParticipant = message.conversation?.participants.some(
      (p) => p.id === userId,
    );

    if (!isParticipant) {
      throw new ForbiddenException('You cannot mark this message as read');
    }

    // Cannot mark own message as read
    if (message.senderId === userId) {
      throw new BadRequestException('Cannot mark your own message as read');
    }

    message.isRead = true;
    return this.messageRepository.save(message);
  }

  async deleteConversation(
    userId: string,
    conversationId: string,
  ): Promise<void> {
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin('conversation.participants', 'participant')
      .where('conversation.id = :conversationId', { conversationId })
      .andWhere('participant.id = :userId', { userId })
      .getOne();

    if (!conversation) {
      throw new ForbiddenException(
        'You are not a participant of this conversation',
      );
    }

    await this.conversationRepository.delete(conversationId);
  }
}
