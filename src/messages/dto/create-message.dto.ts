import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsArray,
  IsObject,
} from 'class-validator';
import { MessageRole } from '../../schemas/message.schema';

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
    description: 'Related articles from AI response (only for System messages)',
    type: [Object],
    required: false,
  })
  @IsOptional()
  @IsArray()
  related_articles?: any[];

  @ApiProperty({
    description:
      'Relationship graph from AI response (only for System messages)',
    type: Object,
    required: false,
  })
  @IsOptional()
  @IsObject()
  relationship_graph?: any;

  @ApiProperty({
    description:
      'Research gaps from AI response (only for System messages with RAG)',
    type: [Object],
    required: false,
  })
  @IsOptional()
  @IsArray()
  research_gaps?: any[];
}
