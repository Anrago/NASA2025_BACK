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
import { RagService } from './rag.service';
import { MessagesService } from '../messages/messages.service';
import { HistoricalService } from '../historical/historical.service';
import {
  VertexAIRequestDto,
  VertexAIResponseDto,
  SimplePromptDto,
  AIResponseDto,
  StructuredPromptDto,
  StructuredResponseDto,
  SimpleStructuredResponseDto,
  TitleGenerationDto,
  TitleResponseDto,
  ChatMessageDto,
  ChatResponseDto,
  RagStructuredResponseDto,
  BulkArticlesResponseDto,
} from './dto';

/**
 * Controller for interacting with Google Cloud VertexAI
 * Provides endpoints for AI content generation and service health checks
 */
@ApiTags('vertex-ai')
@Controller('vertex-ai')
export class VertexAIController {
  constructor(
    private readonly vertexAIService: VertexAIService,
    private readonly ragService: RagService,
    private readonly messagesService: MessagesService,
    private readonly historicalService: HistoricalService,
  ) {}

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
            temperature: process.env.TEMPERATURE,
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
          temperature: process.env.TEMPERATURE,
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

  @Post('prompt')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiBody({
    type: SimplePromptDto,
    examples: {
      simple: {
        value: {
          prompt: 'Explain the significance of the James Webb Space Telescope',
        },
      },
    },
  })
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
        },
      );

      throw new HttpException(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('structured')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiBody({
    type: StructuredPromptDto,
    examples: {
      detailed: {
        value: {
          prompt: 'Explain the theory of relativity',
        },
      },
    },
  })
  async structuredPrompt(
    @Body() promptDto: StructuredPromptDto,
  ): Promise<StructuredResponseDto> {
    try {
      const result = await this.vertexAIService.structuredPrompt(promptDto);

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
      const errorResponse = {
        success: false,
        data: {
          rawResponse: '',
          structuredContent: {
            summary: '',
            mainTopic: '',
            sections: [],
            keyTakeaways: [],
          },
          performance: {
            processingTime: '0ms',
            promptTokens: 0,
            responseTokens: 0,
            totalTokens: 0,
          },
        },
        metadata: {
          requestId: `error_${Date.now()}`,
          timestamp: new Date().toISOString(),
          version: '2.0.0',
          model: 'gemini-2.5-flash-lite',
          temperature: process.env.TEMPERATURE,
          maxTokens: 2048,
          responseFormat: 'structured',
          contentType: 'explanation',
        },
        error: {
          code: 'CONTROLLER_ERROR',
          message: error.message || 'Error interno del servidor',
          details: error.stack,
          suggestions: [
            'Verifica que todos los campos requeridos estén presentes',
            'Revisa el formato del prompt',
            'Intenta con parámetros diferentes',
          ],
        },
      };

      throw new HttpException(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('structured-simple')
  @ApiOperation({
    summary: 'Generate structured content with simplified JSON response format',
  })
  @ApiBody({
    type: StructuredPromptDto,
    examples: {
      simple: {
        value: {
          prompt: 'Explain the theory of relativity',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'Structured content generated successfully with simplified format',
    schema: {
      type: 'object',
      properties: {
        answer: { type: 'string', description: 'The generated response' },
        related_articles: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              year: { type: 'number' },
              authors: { type: 'array', items: { type: 'string' } },
              tags: { type: 'array', items: { type: 'string' } },
            },
          },
        },
        relationship_graph: {
          type: 'object',
          properties: {
            nodes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'Unique identifier in kebab-case',
                  },
                  name: {
                    type: 'string',
                    description: 'Display name for the node',
                  },
                  group: {
                    type: 'string',
                    description: 'Category or group name',
                  },
                },
              },
            },
            links: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  source: { type: 'string', description: 'Source node ID' },
                  target: { type: 'string', description: 'Target node ID' },
                  value: {
                    type: 'number',
                    description: 'Connection strength (1-5)',
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async structuredPromptSimple(
    @Body() promptDto: StructuredPromptDto,
  ): Promise<SimpleStructuredResponseDto> {
    try {
      const result =
        await this.vertexAIService.structuredPromptSimple(promptDto);
      return result;
    } catch (error) {
      // En caso de error, retornar respuesta mock con mensaje de error
      return SimpleStructuredResponseDto.createMockResponse(
        error.message || 'Error al generar contenido estructurado',
      );
    }
  }

  @Post('generate-title')
  @ApiOperation({
    summary: 'Generate a title for a previous response',
    description:
      'Creates a concise, descriptive title based on previously generated content. Useful for creating headlines or summaries of AI-generated responses.',
  })
  @ApiBody({
    type: TitleGenerationDto,
    description: 'The response content to generate a title for',
    examples: {
      photosynthesis: {
        value: {
          response:
            'La fotosíntesis es un proceso biológico fundamental que permite a las plantas convertir la luz solar en energía química. Este proceso ocurre principalmente en los cloroplastos de las hojas y involucra la absorción de dióxido de carbono del aire y agua del suelo para producir glucosa y oxígeno. Durante la fotosíntesis, la energía lumínica se captura mediante moléculas de clorofila, que son responsables del color verde característico de las plantas.',
        },
      },
      space: {
        value: {
          response:
            'El telescopio espacial James Webb representa un avance revolucionario en la astronomía moderna. Con sus instrumentos de alta precisión y su espejo primario de 6.5 metros, puede observar galaxias que se formaron poco después del Big Bang. Sus capacidades infrarrojas le permiten penetrar nubes de polvo cósmico y revelar la formación de estrellas y planetas en regiones previamente ocultas del universo.',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Title generated successfully',
    type: TitleResponseDto,
    examples: {
      photosynthesis: {
        summary: 'Title for photosynthesis content',
        value: {
          title:
            'Fotosíntesis: El Proceso Vital de Conversión de Luz Solar en Energía',
        },
      },
      space: {
        summary: 'Title for space telescope content',
        value: {
          title:
            'James Webb: Revolucionando la Astronomía con Observación Infrarroja',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async generateTitle(
    @Body() titleDto: TitleGenerationDto,
  ): Promise<TitleResponseDto> {
    try {
      const title = await this.vertexAIService.generateTitle(titleDto.response);
      return new TitleResponseDto(title);
    } catch (error) {
      const errorResponse = {
        message: 'Error al generar título',
        error: error.message || 'Error interno del servidor',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };

      throw new HttpException(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Generate content with RAG (Retrieval Augmented Generation)
   * Retrieves relevant information from configured corpus before generating response
   */
  @Post('rag/generate')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Generate content with RAG (Retrieval Augmented Generation)',
    description:
      'Generates AI content using RAG with Google VertexAI, retrieving relevant information from configured corpus before generating response.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'The user prompt for RAG generation',
        },
      },
      required: ['prompt'],
    },
    examples: {
      simple: {
        value: {
          prompt: 'What are the latest findings about Mars exploration?',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'RAG content generated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        content: { type: 'string' },
        timestamp: { type: 'string' },
      },
    },
  })
  async generateWithRag(@Body('prompt') prompt: string) {
    try {
      const content = await this.ragService.generateWithRetrieval(prompt);
      return {
        success: true,
        content,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message || 'RAG generation failed',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Generate structured content with RAG
   * Produces structured JSON content using RAG with answer, related articles, and relationship graph
   */
  @Post('rag/structured')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Generate structured content with RAG',
    description:
      'Generates structured JSON content using RAG with answer, related articles, and relationship graph.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'The user prompt for structured RAG generation',
        },
      },
      required: ['prompt'],
    },
    examples: {
      structured: {
        value: {
          prompt: 'Explain the impact of climate change on space missions',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Structured RAG content generated successfully',
    schema: {
      type: 'object',
      properties: {
        answer: { type: 'string' },
        related_articles: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              year: { type: 'number' },
              authors: { type: 'array', items: { type: 'string' } },
              tags: { type: 'array', items: { type: 'string' } },
            },
          },
        },
        relationship_graph: {
          type: 'object',
          properties: {
            nodes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  group: { type: 'string' },
                },
              },
            },
            links: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  source: { type: 'string' },
                  target: { type: 'string' },
                  value: { type: 'number' },
                },
              },
            },
          },
        },
        research_gaps: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              topic: { type: 'string', description: 'Name of the underexplored area' },
              description: { type: 'string', description: 'Short explanation of the knowledge gap' },
            },
          },
        },
      },
    },
  })
  async generateStructuredWithRag(@Body('prompt') prompt: string): Promise<RagStructuredResponseDto> {
    try {
      const result =
        await this.ragService.generateStructuredWithRetrieval(prompt);
      return result;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message || 'Structured RAG generation failed',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get bulk articles from RAG corpus
   * Retrieves up to 100 articles from the RAG database without filtering
   */
  @Get('rag/articles/bulk')
  @ApiOperation({
    summary: 'Get bulk articles from RAG corpus',
    description:
      'Retrieves up to 100 articles from the RAG database without discrimination or filtering. Returns articles with title, year, authors, and tags.',
  })
  @ApiResponse({
    status: 200,
    description: 'Bulk articles retrieved successfully',
    type: BulkArticlesResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string' },
        timestamp: { type: 'string' },
      },
    },
  })
  async getBulkArticles(): Promise<BulkArticlesResponseDto> {
    try {
      const result = await this.ragService.getBulkArticles();
      return result;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message || 'Bulk articles retrieval failed',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('chat')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Send chat message with history management',
    description:
      'Sends a message to the AI, manages conversation history, and returns the response. ' +
      'Automatically creates or updates chat history and stores both user and system messages.',
  })
  @ApiBody({
    type: ChatMessageDto,
    description: 'Chat message with user and history information',
  })
  @ApiResponse({
    status: 201,
    description: 'Chat message processed successfully',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during chat processing',
  })
  async sendChatMessage(
    @Body() chatMessageDto: ChatMessageDto,
  ): Promise<ChatResponseDto> {
    try {
      // Get AI response using existing service
      const aiResponse = await this.vertexAIService.structuredPromptSimple({
        prompt: chatMessageDto.message,
        temperature: 0.7,
        maxTokens: 2048,
      });

      // Create or get historical record
      let historical;
      if (chatMessageDto.historical_id) {
        // Get existing historical record
        historical = await this.historicalService.findOne(
          chatMessageDto.historical_id,
        );
      } else {
        // Create new historical record
        historical = await this.historicalService.create({
          user_id: chatMessageDto.user_id,
          title: await this.vertexAIService.generateTitle(aiResponse.answer),
        });
      }

      // Create user message record
      await this.messagesService.create({
        historical_user_id: historical._id.toString(),
        rol: 'User',
        message: chatMessageDto.message,
      });

      // Create AI response message record
      await this.messagesService.create({
        historical_user_id: historical._id.toString(),
        rol: 'System',
        message: aiResponse.answer,
      });

      return {
        success: true,
        historical_id: historical._id.toString(),
        response: aiResponse,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        historical_id: null,
        response: null,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
