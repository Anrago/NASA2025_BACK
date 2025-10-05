import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for VertexAI API responses
 * Standardized response format for all VertexAI operations
 */
export class VertexAIResponseDto {
  @ApiProperty({
    description: 'Indicates whether the operation was successful',
    example: true,
    type: 'boolean',
  })
  success: boolean;

  @ApiProperty({
    description:
      'Response data containing the generated content or service information. ' +
      'For content generation: {generatedText, model, parameters}. ' +
      'For health check: {status}.',
    required: false,
    nullable: true,
    example: {
      generatedText: 'The James Webb Space Telescope...',
      model: 'gemini-2.5-flash-lite',
      parameters: {
        temperature: 1,
        maxOutputTokens: 1024,
      },
    },
  })
  data?: any;

  @ApiProperty({
    description: 'Error message if the operation failed',
    required: false,
    nullable: true,
    example: 'Invalid API credentials',
  })
  error?: string;

  @ApiProperty({
    description: 'Human-readable message describing the operation result',
    required: false,
    nullable: true,
    example: 'Content generated successfully',
  })
  message?: string;

  @ApiProperty({
    description: 'ISO 8601 timestamp of when the response was generated',
    example: '2025-10-04T12:00:00.000Z',
  })
  timestamp: string;

  /**
   * Creates a new VertexAIResponseDto
   * @param success - Whether the operation was successful
   * @param data - Optional response data
   * @param error - Optional error message
   * @param message - Optional human-readable message
   */
  constructor(success: boolean, data?: any, error?: string, message?: string) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}
