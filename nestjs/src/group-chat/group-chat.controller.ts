import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GroupChatService } from './group-chat.service';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { AddGroupMemberDto } from './dto/add-group-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { GroupMemberRole } from './entities/group-member.entity';

@ApiTags('Group Chat')
@ApiBearerAuth()
@Controller('group-chat')
@UseGuards(JwtAuthGuard)
export class GroupChatController {
  constructor(private readonly groupChatService: GroupChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group chat' })
  createGroupChat(
    @GetUser() user: User,
    @Body() createGroupChatDto: CreateGroupChatDto,
  ) {
    return this.groupChatService.createGroupChat(user.id, createGroupChatDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user group chats' })
  getUserGroupChats(@GetUser() user: User) {
    return this.groupChatService.getUserGroupChats(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group chat by ID' })
  getGroupChat(@Param('id') id: string) {
    return this.groupChatService.getGroupChatById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update group chat details' })
  updateGroupChat(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateGroupChatDto: UpdateGroupChatDto,
  ) {
    return this.groupChatService.updateGroupChat(
      user.id,
      id,
      updateGroupChatDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a group chat' })
  deleteGroupChat(@GetUser() user: User, @Param('id') id: string) {
    return this.groupChatService.deleteGroupChat(user.id, id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add a member to the group' })
  addMember(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() addGroupMemberDto: AddGroupMemberDto,
  ) {
    return this.groupChatService.addMember(user.id, id, addGroupMemberDto);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Remove a member from the group' })
  removeMember(
    @GetUser() user: User,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    return this.groupChatService.removeMember(user.id, id, memberId);
  }

  @Patch(':id/members/:memberId/role')
  @ApiOperation({ summary: 'Update member role' })
  updateMemberRole(
    @GetUser() user: User,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body('role') role: GroupMemberRole,
  ) {
    return this.groupChatService.updateMemberRole(user.id, id, memberId, role);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get all messages in a group chat' })
  getGroupMessages(@GetUser() user: User, @Param('id') id: string) {
    return this.groupChatService.getGroupMessages(user.id, id);
  }
}
