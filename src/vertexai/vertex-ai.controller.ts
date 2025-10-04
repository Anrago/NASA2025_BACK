import {
  Body,
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { VertexAIService } from './vertex-ai.service';
import { VertexAIRequestDto, VertexAIResponseDto } from './dto';

/**
 * Controller for interacting with Google Cloud VertexAI
 * Provides endpoints for AI content generation and service health checks
 */
@ApiTags('vertex-ai')
@Controller('vertex-ai')
export class VertexAIController {
  constructor(private readonly vertexAIService: VertexAIService) {}

  /**
   * Generate AI content based on a prompt
   * Uses Google's Gemini model through VertexAI to generate text responses
   */
  @Post('generate')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Generate AI content',
    description:
      'Generates text content using Google VertexAI (Gemini model) based on the provided prompt and optional parameters. ' +
      'Useful for generating explanations, answering questions, or creating content related to NASA research and space exploration.',
  })
  @ApiBody({
    type: VertexAIRequestDto,
    description: 'Request containing prompt and generation parameters',
    examples: {
      simple: {
        value: {
          prompt: 'Explain the significance of the James Webb Space Telescope',
        },
        summary: 'Simple prompt without parameters',
      },
      withParameters: {
        value: {
          prompt: 'What are the main challenges of Mars colonization?',
          parameters: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            topP: 0.9,
            topK: 40,
          },
          model: 'gemini-2.5-flash-lite',
        },
        summary: 'Prompt with custom generation parameters',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Content generated successfully',
    type: VertexAIResponseDto,
    example: {
      success: true,
      data: {
        generatedText:
          'The James Webb Space Telescope represents a monumental leap...',
        model: 'gemini-2.5-flash-lite',
        parameters: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      },
      message: 'Content generated successfully',
      timestamp: '2025-10-04T12:00:00.000Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data (validation errors)',
    example: {
      success: false,
      error: 'Validation failed',
      message: 'prompt should not be empty',
      timestamp: '2025-10-04T12:00:00.000Z',
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error or VertexAI API error',
    example: {
      success: false,
      error: 'API quota exceeded',
      message: 'Failed to generate content',
      timestamp: '2025-10-04T12:00:00.000Z',
    },
  })
  async generateContent(
    @Body() requestDto: VertexAIRequestDto,
  ): Promise<VertexAIResponseDto> {
    try {
      const result = await this.vertexAIService.generateContent(requestDto);

      if (!result.success) {
        throw new HttpException(
          {
            success: false,
            error: result.error,
            message: result.message,
            timestamp: result.timestamp,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          error: error.message || 'Internal server error',
          message: 'Failed to generate content',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Check the health status of the VertexAI service
   * Performs a test request to verify the service is operational
   */
  @Get('health')
  @ApiOperation({
    summary: 'Check VertexAI service health',
    description:
      'Verifies that the VertexAI service is properly configured and operational by performing a test generation request. ' +
      'Use this endpoint to diagnose connectivity or configuration issues.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy and operational',
    type: VertexAIResponseDto,
    example: {
      success: true,
      data: {
        status: 'healthy',
      },
      message: 'VertexAI service is working correctly',
      timestamp: '2025-10-04T12:00:00.000Z',
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Service is unavailable or not properly configured',
    example: {
      success: false,
      error: 'Authentication failed',
      message: 'VertexAI service is not available',
      timestamp: '2025-10-04T12:00:00.000Z',
    },
  })
  async healthCheck(): Promise<VertexAIResponseDto> {
    try {
      const result = await this.vertexAIService.healthCheck();

      if (!result.success) {
        throw new HttpException(
          {
            success: false,
            error: result.error,
            message: result.message,
            timestamp: result.timestamp,
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          error: error.message || 'Health check failed',
          message: 'VertexAI service is not available',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
