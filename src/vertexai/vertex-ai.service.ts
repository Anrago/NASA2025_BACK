import { Injectable, Logger } from '@nestjs/common';
import { VertexAI } from '@google-cloud/vertexai';
import { VertexAIRequestDto, VertexAIResponseDto } from './dto';

/**
 * Service for interacting with Google Cloud VertexAI API
 * Handles AI content generation using Google's Gemini models
 *
 * @remarks
 * This service requires proper Google Cloud credentials to be configured.
 * Set the following environment variables:
 * - GOOGLE_CLOUD_PROJECT_ID: Your Google Cloud project ID
 * - GOOGLE_CLOUD_LOCATION: The region for VertexAI (e.g., 'us-central1')
 * - GOOGLE_APPLICATION_CREDENTIALS: Path to service account key JSON file
 */
@Injectable()
export class VertexAIService {
  private readonly logger = new Logger(VertexAIService.name);
  private vertexAI: VertexAI;

  /**
   * Initializes the VertexAI service with Google Cloud credentials
   * Reads configuration from environment variables
   */
  constructor() {
    // Inicializar VertexAI
    // Nota: Necesitarás configurar las credenciales de Google Cloud
    this.vertexAI = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT_ID || 'project-id',
      location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central',
    });
  }

  /**
   * Generates AI content based on a prompt using Google's Gemini model
   *
   * @param requestDto - The request containing the prompt and optional generation parameters
   * @returns Promise resolving to a VertexAIResponseDto with generated content or error
   *
   * @example
   * ```typescript
   * const result = await vertexAIService.generateContent({
   *   prompt: 'Explain black holes',
   *   parameters: { temperature: 0.7, maxOutputTokens: 1024 }
   * });
   * ```
   */
  async generateContent(
    requestDto: VertexAIRequestDto,
  ): Promise<VertexAIResponseDto> {
    try {
      this.logger.log(
        `Generating content with prompt: ${requestDto.prompt.substring(0, 100)}...`,
      );

      // Configurar el modelo (por defecto Gemini Pro)
      const model = requestDto.model || 'gemini-2.5-flash-lite';
      const generativeModel = this.vertexAI.preview.getGenerativeModel({
        model: model,
        generationConfig: {
          temperature: requestDto.parameters?.temperature || 0.7,
          maxOutputTokens: requestDto.parameters?.maxOutputTokens || 1024,
          topP: requestDto.parameters?.topP || 0.8,
          topK: requestDto.parameters?.topK || 40,
        },
      });

      // Generar contenido
      const result = await generativeModel.generateContent(requestDto.prompt);
      const response = await result.response;
      const text =
        response.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No response generated';

      this.logger.log('Content generated successfully');

      return new VertexAIResponseDto(
        true,
        {
          generatedText: text,
          model: model,
          parameters: requestDto.parameters,
        },
        undefined,
        'Content generated successfully',
      );
    } catch (error) {
      this.logger.error('Error generating content:', error);

      return new VertexAIResponseDto(
        false,
        undefined,
        error.message || 'Unknown error occurred',
        'Failed to generate content',
      );
    }
  }

  /**
   * Performs a health check on the VertexAI service
   * Sends a simple test request to verify the service is operational
   *
   * @returns Promise resolving to a VertexAIResponseDto indicating service health
   *
   * @remarks
   * This method performs an actual API call to VertexAI with minimal tokens
   * to verify connectivity and authentication
   */
  async healthCheck(): Promise<VertexAIResponseDto> {
    try {
      // Realizar una verificación básica del servicio
      const testPrompt = 'Hello, can you respond with a simple "OK"?';

      const result = await this.generateContent({
        prompt: testPrompt,
        parameters: {
          temperature: 0.1,
          maxOutputTokens: 10,
        },
      });

      if (result.success) {
        return new VertexAIResponseDto(
          true,
          { status: 'healthy' },
          undefined,
          'VertexAI service is working correctly',
        );
      } else {
        return result;
      }
    } catch (error) {
      this.logger.error('Health check failed:', error);

      return new VertexAIResponseDto(
        false,
        undefined,
        error.message || 'Health check failed',
        'VertexAI service is not healthy',
      );
    }
  }
}
