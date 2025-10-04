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
import { VertexAIRequestDto, VertexAIResponseDto } from './dto';

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
}