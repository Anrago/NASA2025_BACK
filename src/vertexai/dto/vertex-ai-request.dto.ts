import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for VertexAI content generation requests
 * Contains the prompt and optional parameters for controlling the AI model's behavior
 */
export class VertexAIRequestDto {
  @ApiProperty({
    description: 'The prompt or question to send to the AI model',
    example:
      'Explain the significance of the James Webb Space Telescope discoveries',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({
    description:
      'Optional parameters to control the AI model generation behavior. ' +
      'temperature (0.0-1.0): Controls randomness. ' +
      'maxOutputTokens (1-8192): Max response length. ' +
      'topP (0.0-1.0): Nucleus sampling. ' +
      'topK (>=1): Number of top candidates.',
    required: false,
    example: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      topP: 0.8,
      topK: 40,
    },
  })
  @IsOptional()
  @IsObject()
  parameters?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
  };

  @ApiProperty({
    description:
      'The AI model to use for generation. Defaults to gemini-2.5-flash-lite',
    example: 'gemini-2.5-flash-lite',
    required: false,
    default: 'gemini-2.5-flash-lite',
  })
  @IsOptional()
  @IsString()
  model?: string;
}
