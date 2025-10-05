import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsMongoId } from 'class-validator';
import { MessageRole } from '../../schemas/message.schema';
import { articles } from 'src/schemas/articles.schema';

export class CreateMessageDto {
  @ApiProperty({
    description: 'The ID of the chat history this message belongs to',
    example: '507f1f77bcf86cd799439011',
    required: true,
  })
  @IsMongoId()
  historical_user_id: string;

  @ApiProperty({
    description: 'The role of the message sender',
    enum: MessageRole,
    example: MessageRole.USER,
    required: true,
  })
  @IsEnum(MessageRole)
  rol: string;

  @ApiProperty({
    description: 'The content of the message',
    example: 'What are the latest findings from the Mars rover?',
    required: true,
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Articles associated with the message',
    type: [Object],
    required: false,
    example: [
      {
        _id: '507f1f77bcf86cd799439011',
        title: 'Latest Mars Rover Findings',
        year: 2025,
        author: ['John Doe', 'Jane Smith'],
        tags: ['Mars', 'Rover', 'NASA'],
      },
    ],
  })
  articles?: articles[];
}
