import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { GroupChat } from './entities/group-chat.entity';
import { GroupMember, GroupMemberRole } from './entities/group-member.entity';
import { Message } from '../chat/entities/message.entity';
import { User } from '../user/entities/user.entity';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { AddGroupMemberDto } from './dto/add-group-member.dto';

@Injectable()
export class GroupChatService {
  constructor(
    @InjectRepository(GroupChat)
    private groupChatRepository: Repository<GroupChat>,
    @InjectRepository(GroupMember)
    private groupMemberRepository: Repository<GroupMember>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createGroupChat(
    userId: string,
    createGroupChatDto: CreateGroupChatDto,
  ): Promise<GroupChat> {
    const { name, description, avatarUrl, memberIds } = createGroupChatDto;

    // Verify all members exist
    const users = await this.userRepository.find({
      where: { id: In([userId, ...memberIds]) },
    });

    if (users.length !== memberIds.length + 1) {
      throw new NotFoundException('One or more users not found');
    }

    // Create group chat
    const groupChat = this.groupChatRepository.create({
      name,
      description,
      avatarUrl,
      creatorId: userId,
    });

    const savedGroupChat = await this.groupChatRepository.save(groupChat);

    // Add creator as admin
    const creatorMember = this.groupMemberRepository.create({
      groupChatId: savedGroupChat.id,
      userId,
      role: GroupMemberRole.ADMIN,
    });
    await this.groupMemberRepository.save(creatorMember);

    // Add other members
    const members = memberIds.map((memberId) =>
      this.groupMemberRepository.create({
        groupChatId: savedGroupChat.id,
        userId: memberId,
        role: GroupMemberRole.MEMBER,
      }),
    );
    await this.groupMemberRepository.save(members);

    return this.getGroupChatById(savedGroupChat.id);
  }

  async getGroupChatById(id: string): Promise<GroupChat> {
    const groupChat = await this.groupChatRepository.findOne({
      where: { id },
      relations: ['creator', 'members', 'members.user', 'messages', 'messages.sender'],
      order: { messages: { createdAt: 'DESC' } },
    });

    if (!groupChat) {
      throw new NotFoundException('Group chat not found');
    }

    return groupChat;
  }

  async getUserGroupChats(userId: string): Promise<GroupChat[]> {
    const groupChats = await this.groupChatRepository
      .createQueryBuilder('groupChat')
      .innerJoinAndSelect('groupChat.members', 'member')
      .innerJoinAndSelect('member.user', 'user')
      .innerJoinAndSelect('groupChat.creator', 'creator')
      .leftJoinAndSelect('groupChat.messages', 'message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('member.userId = :userId', { userId })
      .orderBy('groupChat.updatedAt', 'DESC')
      .addOrderBy('message.createdAt', 'DESC')
      .getMany();

    return groupChats;
  }

  async updateGroupChat(
    userId: string,
    groupChatId: string,
    updateGroupChatDto: UpdateGroupChatDto,
  ): Promise<GroupChat> {
    // Check if user is admin
    await this.verifyUserIsAdmin(userId, groupChatId);

    const groupChat = await this.groupChatRepository.findOne({
      where: { id: groupChatId },
    });

    if (!groupChat) {
      throw new NotFoundException('Group chat not found');
    }

    Object.assign(groupChat, updateGroupChatDto);
    await this.groupChatRepository.save(groupChat);

    return this.getGroupChatById(groupChatId);
  }

  async addMember(
    userId: string,
    groupChatId: string,
    addGroupMemberDto: AddGroupMemberDto,
  ): Promise<GroupMember> {
    // Check if user is admin
    await this.verifyUserIsAdmin(userId, groupChatId);

    const { userId: newMemberId, role } = addGroupMemberDto;

    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { id: newMemberId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is already a member
    const existingMember = await this.groupMemberRepository.findOne({
      where: { groupChatId, userId: newMemberId },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member of this group');
    }

    const member = this.groupMemberRepository.create({
      groupChatId,
      userId: newMemberId,
      role: role || GroupMemberRole.MEMBER,
    });

    return this.groupMemberRepository.save(member);
  }

  async removeMember(
    userId: string,
    groupChatId: string,
    memberId: string,
  ): Promise<void> {
    // Check if user is admin or removing themselves
    const userMember = await this.groupMemberRepository.findOne({
      where: { groupChatId, userId },
    });

    if (!userMember) {
      throw new ForbiddenException('You are not a member of this group');
    }

    if (userId !== memberId && userMember.role !== GroupMemberRole.ADMIN) {
      throw new ForbiddenException(
        'Only admins can remove other members',
      );
    }

    const memberToRemove = await this.groupMemberRepository.findOne({
      where: { groupChatId, userId: memberId },
    });

    if (!memberToRemove) {
      throw new NotFoundException('Member not found in this group');
    }

    // Cannot remove the creator
    const groupChat = await this.groupChatRepository.findOne({
      where: { id: groupChatId },
    });

    if (groupChat.creatorId === memberId) {
      throw new BadRequestException('Cannot remove the group creator');
    }

    await this.groupMemberRepository.remove(memberToRemove);
  }

  async updateMemberRole(
    userId: string,
    groupChatId: string,
    memberId: string,
    role: GroupMemberRole,
  ): Promise<GroupMember> {
    // Check if user is admin
    await this.verifyUserIsAdmin(userId, groupChatId);

    const member = await this.groupMemberRepository.findOne({
      where: { groupChatId, userId: memberId },
    });

    if (!member) {
      throw new NotFoundException('Member not found in this group');
    }

    // Cannot change creator's role
    const groupChat = await this.groupChatRepository.findOne({
      where: { id: groupChatId },
    });

    if (groupChat.creatorId === memberId) {
      throw new BadRequestException("Cannot change the creator's role");
    }

    member.role = role;
    return this.groupMemberRepository.save(member);
  }

  async getGroupMessages(
    userId: string,
    groupChatId: string,
  ): Promise<Message[]> {
    // Verify user is a member
    await this.verifyUserIsMember(userId, groupChatId);

    return this.messageRepository.find({
      where: { groupChatId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async deleteGroupChat(userId: string, groupChatId: string): Promise<void> {
    const groupChat = await this.groupChatRepository.findOne({
      where: { id: groupChatId },
    });

    if (!groupChat) {
      throw new NotFoundException('Group chat not found');
    }

    // Only creator can delete the group
    if (groupChat.creatorId !== userId) {
      throw new ForbiddenException('Only the creator can delete this group');
    }

    await this.groupChatRepository.delete(groupChatId);
  }

  private async verifyUserIsMember(
    userId: string,
    groupChatId: string,
  ): Promise<GroupMember> {
    const member = await this.groupMemberRepository.findOne({
      where: { groupChatId, userId },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this group');
    }

    return member;
  }

  private async verifyUserIsAdmin(
    userId: string,
    groupChatId: string,
  ): Promise<GroupMember> {
    const member = await this.verifyUserIsMember(userId, groupChatId);

    if (member.role !== GroupMemberRole.ADMIN) {
      throw new ForbiddenException('Only admins can perform this action');
    }

    return member;
  }
}
