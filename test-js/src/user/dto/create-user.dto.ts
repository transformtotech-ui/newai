import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  name: string;

  @ApiProperty({ example: '123 Main St, New York, NY', description: 'The address of the user' })
  address: string;
}
