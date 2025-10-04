import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class CreateHistoricalDto {
  @ApiProperty({
    description: 'The ID of the user who owns this chat history',
    example: '507f1f77bcf86cd799439011',
    required: true,
  })
  @IsMongoId()
  user_id: string;

  @ApiProperty({
    description: 'The title or name of the chat conversation (optional)',
    example: 'NASA Research Discussion',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;
}
