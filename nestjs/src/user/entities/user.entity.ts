import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ObjectType, Field, ID, HideField } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

@Entity('users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  @Field()
  firstName: string;

  @Column()
  @Field()
  lastName: string;

  @Column()
  @HideField()
  @Exclude()
  password: string;

  @Column({ default: true })
  @Field()
  isActive: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  phoneNumber?: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // Virtual field for GraphQL
  @Field()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}