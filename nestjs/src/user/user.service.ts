import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating new user with email: ${createUserDto.email}`);
    
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      const user = this.userRepository.create(createUserDto);
      const savedUser = await this.userRepository.save(user);
      
      this.logger.log(`User created successfully with ID: ${savedUser.id}`);
      
      // Remove password from response
      delete savedUser.password;
      return savedUser;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    this.logger.log('Fetching all users');
    
    const users = await this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'isActive', 'avatar', 'phoneNumber', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' },
    });

    this.logger.log(`Found ${users.length} users`);
    return users;
  }

  async findOne(id: string): Promise<User> {
    this.logger.log(`Finding user with ID: ${id}`);
    
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'isActive', 'avatar', 'phoneNumber', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.log(`Finding user by email: ${email}`);
    
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    this.logger.log(`Finding user by email with password: ${email}`);
    
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'firstName', 'lastName', 'password', 'isActive'],
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}`);
    
    const user = await this.findOne(id);

    // If email is being updated, check for conflicts
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    try {
      Object.assign(user, updateUserDto);
      const updatedUser = await this.userRepository.save(user);
      
      this.logger.log(`User updated successfully with ID: ${updatedUser.id}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing user with ID: ${id}`);
    
    const user = await this.findOne(id);
    
    try {
      await this.userRepository.remove(user);
      this.logger.log(`User removed successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error removing user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async toggleActiveStatus(id: string): Promise<User> {
    this.logger.log(`Toggling active status for user with ID: ${id}`);
    
    const user = await this.findOne(id);
    user.isActive = !user.isActive;
    
    const updatedUser = await this.userRepository.save(user);
    this.logger.log(`User active status toggled for ID: ${id}, new status: ${updatedUser.isActive}`);
    
    return updatedUser;
  }

  async getUsersCount(): Promise<number> {
    const count = await this.userRepository.count();
    this.logger.log(`Total users count: ${count}`);
    return count;
  }

  async getActiveUsersCount(): Promise<number> {
    const count = await this.userRepository.count({ where: { isActive: true } });
    this.logger.log(`Active users count: ${count}`);
    return count;
  }
}