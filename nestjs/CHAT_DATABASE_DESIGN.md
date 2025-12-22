# Chat & Group Chat System - Database Design

## Overview
This document describes the database design for the chat and group chat functionality in the NestJS application.

## Database Schema

### Tables

#### 1. **conversations**
Stores one-on-one conversations between two users.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Relationships:**
- Many-to-Many with `users` through `conversation_participants` join table
- One-to-Many with `messages`

#### 2. **conversation_participants**
Join table for conversation participants.

| Column | Type | Description |
|--------|------|-------------|
| conversation_id | UUID | Foreign key to conversations |
| user_id | UUID | Foreign key to users |

#### 3. **messages**
Stores all messages (both one-on-one and group chat).

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| content | TEXT | Message content |
| attachment_url | VARCHAR | Optional attachment URL |
| is_read | BOOLEAN | Read status (default: false) |
| sender_id | UUID | Foreign key to users |
| conversation_id | UUID | Foreign key to conversations (nullable) |
| group_chat_id | UUID | Foreign key to group_chats (nullable) |
| created_at | TIMESTAMP | Creation timestamp |

**Relationships:**
- Many-to-One with `users` (sender)
- Many-to-One with `conversations` (optional)
- Many-to-One with `group_chats` (optional)

**Constraints:**
- Either `conversation_id` OR `group_chat_id` must be set (not both)

#### 4. **group_chats**
Stores group chat information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR | Group name |
| description | TEXT | Group description (optional) |
| avatar_url | VARCHAR | Group avatar URL (optional) |
| creator_id | UUID | Foreign key to users |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Relationships:**
- Many-to-One with `users` (creator)
- One-to-Many with `group_members`
- One-to-Many with `messages`

#### 5. **group_members**
Stores group membership and roles.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| group_chat_id | UUID | Foreign key to group_chats |
| user_id | UUID | Foreign key to users |
| role | ENUM | Member role (admin, member) |
| joined_at | TIMESTAMP | Join timestamp |

**Relationships:**
- Many-to-One with `group_chats`
- Many-to-One with `users`

**Enums:**
- `role`: 'admin' | 'member'

## Entity Relationships Diagram

```
┌─────────────┐
│    users    │
└──────┬──────┘
       │
       ├──────────────────┐
       │                  │
       ↓                  ↓
┌─────────────────┐  ┌──────────────────┐
│ conversations   │  │   group_chats    │
│ (Many-to-Many)  │  │   (creator)      │
└────────┬────────┘  └────────┬─────────┘
         │                    │
         │                    ├───────────────┐
         │                    │               │
         ↓                    ↓               ↓
   ┌──────────┐        ┌──────────┐   ┌──────────────┐
   │ messages │        │ messages │   │group_members │
   └──────────┘        └──────────┘   └──────────────┘
```

## Key Features

### One-on-One Chat
- **Conversation Creation**: Automatically checks if a conversation already exists
- **Message Sending**: Users can send text messages and attachments
- **Read Receipts**: Track message read status
- **Participant Validation**: Ensures users can only access conversations they're part of

### Group Chat
- **Group Management**:
  - Create groups with multiple members
  - Update group details (name, description, avatar)
  - Delete groups (creator only)
  
- **Member Management**:
  - Add/remove members (admin only)
  - Role-based access control (admin/member)
  - Creator is automatically set as admin
  - Creator cannot be removed or have role changed
  
- **Messaging**:
  - Send messages to the group
  - All members can view group messages
  - Messages are ordered by creation time

## Security Features

1. **Authorization**:
   - JWT-based authentication required for all endpoints
   - Users can only access their own conversations and groups
   - Role-based permissions for group operations

2. **Validation**:
   - Cannot create conversation with yourself
   - Cannot send message to both conversation and group simultaneously
   - Creator validation for sensitive operations
   - Member existence validation

3. **Data Integrity**:
   - Cascade deletes for conversations and group chats
   - Foreign key constraints
   - Unique constraints on join tables

## API Endpoints

### REST API

#### Chat Endpoints
- `POST /chat/conversations` - Create conversation
- `GET /chat/conversations` - Get user conversations
- `GET /chat/conversations/:id` - Get conversation details
- `DELETE /chat/conversations/:id` - Delete conversation
- `POST /chat/messages` - Send message
- `GET /chat/conversations/:id/messages` - Get conversation messages
- `PATCH /chat/messages/:id/read` - Mark message as read

#### Group Chat Endpoints
- `POST /group-chat` - Create group chat
- `GET /group-chat` - Get user group chats
- `GET /group-chat/:id` - Get group chat details
- `PATCH /group-chat/:id` - Update group chat
- `DELETE /group-chat/:id` - Delete group chat
- `POST /group-chat/:id/members` - Add member
- `DELETE /group-chat/:id/members/:memberId` - Remove member
- `PATCH /group-chat/:id/members/:memberId/role` - Update member role
- `GET /group-chat/:id/messages` - Get group messages

### GraphQL API

#### Queries
- `myConversations` - Get user conversations
- `conversation(id: String!)` - Get conversation by ID
- `conversationMessages(conversationId: String!)` - Get messages
- `myGroupChats` - Get user group chats
- `groupChat(id: String!)` - Get group chat by ID
- `groupChatMessages(groupChatId: String!)` - Get group messages

#### Mutations
- `createConversation(input: CreateConversationDto!)` - Create conversation
- `sendMessage(input: CreateMessageDto!)` - Send message
- `markMessageAsRead(messageId: String!)` - Mark as read
- `deleteConversation(conversationId: String!)` - Delete conversation
- `createGroupChat(input: CreateGroupChatDto!)` - Create group
- `updateGroupChat(id: String!, input: UpdateGroupChatDto!)` - Update group
- `deleteGroupChat(id: String!)` - Delete group
- `addGroupMember(groupChatId: String!, input: AddGroupMemberDto!)` - Add member
- `removeGroupMember(groupChatId: String!, memberId: String!)` - Remove member
- `updateGroupMemberRole(groupChatId: String!, memberId: String!, role: GroupMemberRole!)` - Update role

## Usage Examples

### Creating a Conversation (REST)
```bash
POST /chat/conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "participantId": "user-uuid"
}
```

### Sending a Message (GraphQL)
```graphql
mutation {
  sendMessage(input: {
    content: "Hello!",
    conversationId: "conversation-uuid"
  }) {
    id
    content
    sender {
      id
      fullName
    }
    createdAt
  }
}
```

### Creating a Group Chat (REST)
```bash
POST /group-chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Project Team",
  "description": "Discussion for our project",
  "memberIds": ["user-uuid-1", "user-uuid-2"]
}
```

## Performance Considerations

1. **Indexing**:
   - Index on `sender_id` in messages table
   - Index on `conversation_id` and `group_chat_id` in messages table
   - Composite index on `conversation_participants` (conversation_id, user_id)
   - Composite index on `group_members` (group_chat_id, user_id)

2. **Query Optimization**:
   - Use eager loading for frequently accessed relationships
   - Limit message queries with pagination (recommended for future enhancement)
   - Order by timestamps for efficient sorting

3. **Future Enhancements**:
   - Add pagination for messages
   - Implement WebSocket support for real-time messaging
   - Add message search functionality
   - Implement typing indicators
   - Add support for message reactions
   - Implement message editing and deletion
   - Add media file upload support
   - Implement push notifications
