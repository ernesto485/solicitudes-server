import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    example: UserRole.USER,
    required: false,
  })
  role?: UserRole;
}
