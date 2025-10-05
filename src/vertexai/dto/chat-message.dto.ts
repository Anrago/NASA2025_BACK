import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({
    description: 'The message content from the user',
    example: 'What are the effects of microgravity on plant growth?',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description:
      'Historical ID to associate the message with (optional for new chats)',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @IsOptional()
  @IsString()
  historical_id?: string;

  @ApiProperty({
    description: 'User ID who is sending the message',
    example: '507f1f77bcf86cd799439012',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;
}
