import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class VertexAIRequestDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsOptional()
  @IsObject()
  parameters?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
  };

  @IsOptional()
  @IsString()
  model?: string;
}