import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'Jane Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'jane.doe@nasa.gov',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Profile image URL',
    example: 'https://example.com/new-profile.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;
}
