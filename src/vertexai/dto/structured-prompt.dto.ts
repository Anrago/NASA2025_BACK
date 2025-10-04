import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max, IsBoolean, IsEnum } from 'class-validator';

export enum ResponseFormat {
  TEXT = 'text',
  STRUCTURED = 'structured',
  JSON = 'json',
  MARKDOWN = 'markdown'
}

export enum ContentType {
  EXPLANATION = 'explanation',
  LIST = 'list',
  TUTORIAL = 'tutorial',
  CODE = 'code',
  CREATIVE = 'creative',
  ANALYSIS = 'analysis',
  QUESTION_ANSWER = 'question_answer'
}

export class StructuredPromptDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsOptional()
  @IsEnum(ResponseFormat)
  responseFormat?: ResponseFormat;

  @IsOptional()
  @IsEnum(ContentType)
  contentType?: ContentType;

  @IsOptional()
  @IsBoolean()
  includeExamples?: boolean;

  @IsOptional()
  @IsBoolean()
  includeSources?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(8192)
  maxTokens?: number;

  @IsOptional()
  @IsString()
  context?: string;
}