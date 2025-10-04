import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@nasa.gov',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'SecurePassword123!',
    required: true,
  })
  password: string;

  @ApiProperty({
    description: 'Profile image URL (optional)',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  image?: string;
}
