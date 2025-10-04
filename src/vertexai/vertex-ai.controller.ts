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
import { VertexAIService } from './vertex-ai.service';
import { VertexAIRequestDto, VertexAIResponseDto, SimplePromptDto, AIResponseDto } from './dto';

@Controller('vertex-ai')
export class VertexAIController {
  constructor(private readonly vertexAIService: VertexAIService) {}

  @Post('generate')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
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

  @Get('health')
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

  @Post('prompt')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async simplePrompt(
    @Body() promptDto: SimplePromptDto,
  ): Promise<AIResponseDto> {
    try {
      const result = await this.vertexAIService.simplePrompt(promptDto);
      
      if (!result.success && result.error) {
        throw new HttpException(
          {
            success: false,
            error: result.error,
            metadata: result.metadata,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // Crear respuesta de error estructurada
      const errorResponse = new AIResponseDto(
        false,
        '',
        'gemini-2.5-flash-lite',
        0.7,
        '0ms',
        undefined,
        undefined,
        {
          code: 'CONTROLLER_ERROR',
          message: error.message || 'Error interno del servidor',
          details: error.stack,
        }
      );

      throw new HttpException(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}