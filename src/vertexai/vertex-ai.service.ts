import { Injectable, Logger } from '@nestjs/common';
import { VertexAI } from '@google-cloud/vertexai';
import { VertexAIRequestDto, VertexAIResponseDto } from './dto';

@Injectable()
export class VertexAIService {
  private readonly logger = new Logger(VertexAIService.name);
  private vertexAI: VertexAI;

  constructor() {
    // Inicializar VertexAI
    // Nota: Necesitarás configurar las credenciales de Google Cloud
    this.vertexAI = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT_ID || 'project-id',
      location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central',
    });
  }

  async generateContent(requestDto: VertexAIRequestDto): Promise<VertexAIResponseDto> {
    try {
      this.logger.log(`Generating content with prompt: ${requestDto.prompt.substring(0, 100)}...`);

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
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

      this.logger.log('Content generated successfully');

      return new VertexAIResponseDto(
        true,
        {
          generatedText: text,
          model: model,
          parameters: requestDto.parameters,
        },
        undefined,
        'Content generated successfully'
      );

    } catch (error) {
      this.logger.error('Error generating content:', error);
      
      return new VertexAIResponseDto(
        false,
        undefined,
        error.message || 'Unknown error occurred',
        'Failed to generate content'
      );
    }
  }

  async healthCheck(): Promise<VertexAIResponseDto> {
    try {
      // Realizar una verificación básica del servicio
      const testPrompt = 'Hello, can you respond with a simple "OK"?';
      
      const result = await this.generateContent({
        prompt: testPrompt,
        parameters: {
          temperature: 0.1,
          maxOutputTokens: 10,
        }
      });

      if (result.success) {
        return new VertexAIResponseDto(
          true,
          { status: 'healthy' },
          undefined,
          'VertexAI service is working correctly'
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
        'VertexAI service is not healthy'
      );
    }
  }
}