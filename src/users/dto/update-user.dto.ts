import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'Jane Doe',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'jane.doe@nasa.gov',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Profile image URL',
    example: 'https://example.com/new-profile.jpg',
    required: false,
  })
  image?: string;
}
