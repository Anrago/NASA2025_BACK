import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class Auth {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john@nasa.gov',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'SecurePassword123!',
  })
  @IsNotEmpty()
  password: string;
}
