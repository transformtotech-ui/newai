import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @Column()
  name: string;

  @ApiProperty({ example: '123 Main St, New York, NY', description: 'The address of the user' })
  @Column()
  address: string;
}
