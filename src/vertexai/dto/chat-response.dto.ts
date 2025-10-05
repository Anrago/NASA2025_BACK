import { ApiProperty } from '@nestjs/swagger';
import { SimpleStructuredResponseDto } from './simple-structured-response.dto';

export class ChatResponseDto {
  @ApiProperty({
    description: 'Whether the chat message was processed successfully',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'The historical ID associated with this chat session',
    example: '507f1f77bcf86cd799439011',
  })
  historical_id: string | null;

  @ApiProperty({
    description: 'The complete AI response including structured data',
    type: SimpleStructuredResponseDto,
  })
  response: SimpleStructuredResponseDto | null;

  @ApiProperty({
    description: 'Error message if processing failed',
    example: 'Failed to generate response',
    required: false,
  })
  error?: string;

  @ApiProperty({
    description: 'Timestamp of the response',
    example: '2025-01-07T10:30:00.000Z',
  })
  timestamp: string;
}
