import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Context,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('input') createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async user(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@Context() context): Promise<User> {
    const userId = context.req.user.id;
    return this.userService.findOne(userId);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateProfile(
    @Args('input') updateUserDto: UpdateUserDto,
    @Context() context,
  ): Promise<User> {
    const userId = context.req.user.id;
    return this.userService.update(userId, updateUserDto);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async toggleUserStatus(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<User> {
    return this.userService.toggleActiveStatus(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteUser(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.userService.remove(id);
    return true;
  }
}