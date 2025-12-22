import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { GroupChat } from './entities/group-chat.entity';
import { GroupMember, GroupMemberRole } from './entities/group-member.entity';
import { Message } from '../chat/entities/message.entity';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { AddGroupMemberDto } from './dto/add-group-member.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Resolver(() => GroupChat)
@UseGuards(GqlAuthGuard)
export class GroupChatResolver {
  constructor(private readonly groupChatService: GroupChatService) {}

  @Mutation(() => GroupChat)
  async createGroupChat(
    @GetUser() user: User,
    @Args('input') createGroupChatDto: CreateGroupChatDto,
  ): Promise<GroupChat> {
    return this.groupChatService.createGroupChat(user.id, createGroupChatDto);
  }

  @Query(() => [GroupChat])
  async myGroupChats(@GetUser() user: User): Promise<GroupChat[]> {
    return this.groupChatService.getUserGroupChats(user.id);
  }

  @Query(() => GroupChat)
  async groupChat(@Args('id') id: string): Promise<GroupChat> {
    return this.groupChatService.getGroupChatById(id);
  }

  @Mutation(() => GroupChat)
  async updateGroupChat(
    @GetUser() user: User,
    @Args('id') id: string,
    @Args('input') updateGroupChatDto: UpdateGroupChatDto,
  ): Promise<GroupChat> {
    return this.groupChatService.updateGroupChat(
      user.id,
      id,
      updateGroupChatDto,
    );
  }

  @Mutation(() => Boolean)
  async deleteGroupChat(
    @GetUser() user: User,
    @Args('id') id: string,
  ): Promise<boolean> {
    await this.groupChatService.deleteGroupChat(user.id, id);
    return true;
  }

  @Mutation(() => GroupMember)
  async addGroupMember(
    @GetUser() user: User,
    @Args('groupChatId') groupChatId: string,
    @Args('input') addGroupMemberDto: AddGroupMemberDto,
  ): Promise<GroupMember> {
    return this.groupChatService.addMember(
      user.id,
      groupChatId,
      addGroupMemberDto,
    );
  }

  @Mutation(() => Boolean)
  async removeGroupMember(
    @GetUser() user: User,
    @Args('groupChatId') groupChatId: string,
    @Args('memberId') memberId: string,
  ): Promise<boolean> {
    await this.groupChatService.removeMember(user.id, groupChatId, memberId);
    return true;
  }

  @Mutation(() => GroupMember)
  async updateGroupMemberRole(
    @GetUser() user: User,
    @Args('groupChatId') groupChatId: string,
    @Args('memberId') memberId: string,
    @Args('role', { type: () => GroupMemberRole }) role: GroupMemberRole,
  ): Promise<GroupMember> {
    return this.groupChatService.updateMemberRole(
      user.id,
      groupChatId,
      memberId,
      role,
    );
  }

  @Query(() => [Message])
  async groupChatMessages(
    @GetUser() user: User,
    @Args('groupChatId') groupChatId: string,
  ): Promise<Message[]> {
    return this.groupChatService.getGroupMessages(user.id, groupChatId);
  }
}
