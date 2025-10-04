import { Injectable, Logger } from '@nestjs/common';
import { VertexAI } from '@google-cloud/vertexai';
import {
  VertexAIRequestDto,
  VertexAIResponseDto,
  SimplePromptDto,
  AIResponseDto,
  StructuredPromptDto,
  StructuredResponseDto,
  SimpleStructuredResponseDto,
  ResponseFormat,
  ContentType,
  StructuredContent
} from './dto';
import { ContentProcessorService } from './content-processor.service';
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
  constructor(private readonly contentProcessor: ContentProcessorService) {
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
          result.message,
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

  async simplePrompt(promptDto: SimplePromptDto): Promise<AIResponseDto> {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    try {
      this.logger.log(
        `[${requestId}] Processing prompt: ${promptDto.prompt.substring(0, 100)}...`,
      );

      const model = 'gemini-2.5-flash-lite';
      const temperature = promptDto.temperature || 0.7;
      const maxTokens = promptDto.maxTokens || 1024;

      const generativeModel = this.vertexAI.preview.getGenerativeModel({
        model: model,
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          topP: 0.8,
          topK: 40,
        },
      });

      // Generar contenido
      const result = await generativeModel.generateContent(promptDto.prompt);
      const response = await result.response;
      const generatedText =
        response.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No se pudo generar respuesta';

      const endTime = Date.now();
      const processingTime = `${endTime - startTime}ms`;

      // Calcular tokens (aproximado)
      const promptTokens = Math.ceil(promptDto.prompt.length / 4);
      const responseTokens = Math.ceil(generatedText.length / 4);
      const totalTokens = promptTokens + responseTokens;

      this.logger.log(
        `[${requestId}] Content generated successfully in ${processingTime}`,
      );

      return new AIResponseDto(
        true,
        generatedText,
        model,
        temperature,
        processingTime,
        requestId,
        {
          promptTokens,
          responseTokens,
          totalTokens,
        },
      );
    } catch (error) {
      const endTime = Date.now();
      const processingTime = `${endTime - startTime}ms`;

      this.logger.error(`[${requestId}] Error generating content:`, error);

      return new AIResponseDto(
        false,
        '',
        'gemini-2.5-flash-lite',
        promptDto.temperature || 0.7,
        processingTime,
        requestId,
        undefined,
        {
          code: 'GENERATION_ERROR',
          message: error.message || 'Error desconocido al generar contenido',
          details: error.stack,
        },
      );
    }
  }

  async structuredPrompt(promptDto: StructuredPromptDto): Promise<StructuredResponseDto> {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    try {
      this.logger.log(`[${requestId}] Processing structured prompt: ${promptDto.prompt.substring(0, 100)}...`);

      const model = 'gemini-2.5-flash-lite';
      const temperature = promptDto.temperature || 0.7;
      const maxTokens = promptDto.maxTokens || 2048;
      const responseFormat = promptDto.responseFormat || ResponseFormat.STRUCTURED;
      const contentType = promptDto.contentType || ContentType.EXPLANATION;

      // Construir prompt mejorado basado en el tipo de contenido y formato
      const enhancedPrompt = this.buildEnhancedPrompt(promptDto, responseFormat, contentType);

      const generativeModel = this.vertexAI.preview.getGenerativeModel({
        model: model,
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          topP: 0.8,
          topK: 40,
        },
      });

      // Generar contenido
      const result = await generativeModel.generateContent(enhancedPrompt);
      const response = await result.response;
      const rawResponse = response.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar respuesta';

      const endTime = Date.now();
      const processingTime = `${endTime - startTime}ms`;

      // Procesar el contenido para estructurarlo
      const structuredContent = await this.contentProcessor.processContent(
        rawResponse,
        contentType,
        promptDto.includeExamples
      );

      // Calcular métricas de rendimiento
      const promptTokens = Math.ceil(enhancedPrompt.length / 4);
      const responseTokens = Math.ceil(rawResponse.length / 4);
      const totalTokens = promptTokens + responseTokens;

      const performance = {
        processingTime,
        promptTokens,
        responseTokens,
        totalTokens,
        modelConfidence: this.calculateConfidence(rawResponse),
        contentQuality: this.assessContentQuality(structuredContent),
      };

      const metadata = {
        requestId,
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        model,
        temperature,
        maxTokens,
        responseFormat,
        contentType,
      };

      this.logger.log(`[${requestId}] Structured content generated successfully in ${processingTime}`);

      return new StructuredResponseDto(
        true,
        rawResponse,
        structuredContent,
        performance,
        metadata
      );

    } catch (error) {
      const endTime = Date.now();
      const processingTime = `${endTime - startTime}ms`;
      
      this.logger.error(`[${requestId}] Error generating structured content:`, error);
      
      const performance = {
        processingTime,
        promptTokens: 0,
        responseTokens: 0,
        totalTokens: 0,
      };

      const metadata = {
        requestId,
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        model: 'gemini-2.5-flash-lite',
        temperature: promptDto.temperature || 0.7,
        maxTokens: promptDto.maxTokens || 2048,
        responseFormat: promptDto.responseFormat || ResponseFormat.STRUCTURED,
        contentType: promptDto.contentType || ContentType.EXPLANATION,
      };
      
      return StructuredResponseDto.createError(
        'STRUCTURED_GENERATION_ERROR',
        error.message || 'Error al generar contenido estructurado',
        metadata,
        performance,
        error.stack,
        [
          'Verifica que el prompt sea claro y específico',
          'Intenta reducir la complejidad del contenido solicitado',
          'Revisa la configuración de parámetros'
        ]
      );
    }
  }

  private buildEnhancedPrompt(promptDto: StructuredPromptDto, responseFormat: ResponseFormat, contentType: ContentType): string {
    let enhancedPrompt = promptDto.prompt;

    // Agregar contexto si se proporciona
    if (promptDto.context) {
      enhancedPrompt = `Contexto: ${promptDto.context}\n\nPregunta: ${enhancedPrompt}`;
    }

    // Instrucciones específicas según el tipo de contenido
    const contentInstructions = this.getContentInstructions(contentType);
    
    // Instrucciones de formato
    const formatInstructions = this.getFormatInstructions(responseFormat, promptDto.includeExamples);

    enhancedPrompt += `\n\n${contentInstructions}\n\n${formatInstructions}`;

    return enhancedPrompt;
  }

  private getContentInstructions(contentType: ContentType): string {
    const instructions = {
      [ContentType.EXPLANATION]: 'Proporciona una explicación clara y detallada. Organiza la información de manera lógica con introducción, desarrollo y conclusión.',
      [ContentType.LIST]: 'Presenta la información como una lista estructurada con elementos claros y concisos.',
      [ContentType.TUTORIAL]: 'Crea un tutorial paso a paso con instrucciones claras y progresivas.',
      [ContentType.CODE]: 'Incluye ejemplos de código bien comentados y explicaciones técnicas precisas.',
      [ContentType.CREATIVE]: 'Usa tu creatividad para generar contenido original e interesante.',
      [ContentType.ANALYSIS]: 'Realiza un análisis profundo con evaluación crítica y conclusiones fundamentadas.',
      [ContentType.QUESTION_ANSWER]: 'Responde de manera directa y completa, abordando todos los aspectos de la pregunta.',
    };

    return instructions[contentType] || instructions[ContentType.EXPLANATION];
  }

  private getFormatInstructions(responseFormat: ResponseFormat, includeExamples?: boolean): string {
    let instructions = '';

    switch (responseFormat) {
      case ResponseFormat.STRUCTURED:
        instructions = 'Estructura tu respuesta con títulos y subtítulos claros. Usa formato markdown para mejorar la legibilidad.';
        break;
      case ResponseFormat.JSON:
        instructions = 'Si es apropiado, incluye datos estructurados en formato JSON válido.';
        break;
      case ResponseFormat.MARKDOWN:
        instructions = 'Usa formato markdown completo con títulos, listas, enlaces y formato de código cuando sea necesario.';
        break;
      case ResponseFormat.TEXT:
        instructions = 'Presenta la información en texto plano bien organizado.';
        break;
    }

    if (includeExamples) {
      instructions += ' Incluye ejemplos prácticos y casos de uso cuando sea relevante.';
    }

    return instructions;
  }

  private calculateConfidence(response: string): number {
    // Algoritmo simple para calcular confianza basado en la calidad de la respuesta
    let confidence = 0.5;

    // Penalizar respuestas muy cortas
    if (response.length < 100) confidence -= 0.2;
    if (response.length > 500) confidence += 0.2;

    // Bonificar por estructura
    if (response.includes('\n\n')) confidence += 0.1; // Párrafos
    if (response.match(/^#+\s/gm)) confidence += 0.1; // Headers markdown
    if (response.match(/^\d+\./gm)) confidence += 0.1; // Listas numeradas

    // Bonificar por contenido específico
    if (response.includes('ejemplo')) confidence += 0.1;
    if (response.includes('```')) confidence += 0.1; // Código

    return Math.min(1.0, Math.max(0.0, confidence));
  }

  private assessContentQuality(content: StructuredContent): number {
    let quality = 0.5;

    // Evaluar completitud
    if (content.sections.length > 1) quality += 0.2;
    if (content.keyTakeaways.length > 0) quality += 0.1;
    if (content.summary.length > 50) quality += 0.1;

    // Evaluar estructura
    const hasSubsections = content.sections.some(s => s.subsections && s.subsections.length > 0);
    if (hasSubsections) quality += 0.1;

    // Evaluar contenido enriquecido
    const hasExamples = content.sections.some(s => s.examples && s.examples.length > 0);
    const hasCode = content.sections.some(s => s.codeSnippets && s.codeSnippets.length > 0);
    
    if (hasExamples) quality += 0.1;
    if (hasCode) quality += 0.1;

    return Math.min(1.0, Math.max(0.0, quality));
  }

  /**
   * Generates simple structured content using AI with scientific template
   * Uses VERTEXAI_MESSAGE_TEMPLATE from environment variables
   * Returns JSON with answer, related_articles, and relationship_graph
   */
  async structuredPromptSimple(promptDto: StructuredPromptDto): Promise<SimpleStructuredResponseDto> {
    const startTime = Date.now();
    const requestId = `struct_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    try {
      this.logger.log(`[${requestId}] Processing simple structured prompt: ${promptDto.prompt.substring(0, 100)}...`);

      const model = 'gemini-2.5-flash-lite';
      const temperature = promptDto.temperature || 0.3; // Lower temperature for more consistent JSON
      const maxTokens = promptDto.maxTokens || 4096; // Higher token limit for complete responses

      // Construir prompt usando el template del .env
      const enhancedPrompt = this.buildScientificStructuredPrompt(promptDto.prompt);

      const generativeModel = this.vertexAI.preview.getGenerativeModel({
        model: model,
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          topP: 0.8,
          topK: 40,
        },
      });

      // Generar contenido
      const result = await generativeModel.generateContent(enhancedPrompt);
      const response = await result.response;
      const rawResponse = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

      const endTime = Date.now();
      const processingTime = `${endTime - startTime}ms`;

      this.logger.log(`[${requestId}] Scientific structured content generated successfully in ${processingTime}`);

      // Intentar parsear la respuesta JSON del modelo
      try {
        const jsonResponse = this.extractAndParseJSON(rawResponse);
        
        // Validar que tenga la estructura requerida
        if (jsonResponse && jsonResponse.answer && jsonResponse.related_articles && jsonResponse.relationship_graph) {
          return {
            answer: jsonResponse.answer,
            related_articles: jsonResponse.related_articles,
            relationship_graph: jsonResponse.relationship_graph
          };
        } else {
          throw new Error('Invalid JSON structure received from model');
        }
      } catch (parseError) {
        this.logger.warn(`[${requestId}] Could not parse JSON response, using fallback: ${parseError.message}`);
        
        // Fallback: retornar respuesta mock con el contenido generado
        return SimpleStructuredResponseDto.createMockResponse(rawResponse.trim());
      }

    } catch (error) {
      this.logger.error(`[${requestId}] Error generating scientific structured content:`, error);
      
      // Retornar respuesta de error usando el método estático
      return SimpleStructuredResponseDto.createMockResponse(
        'Error al generar contenido científico. Por favor, intenta nuevamente.'
      );
    }
  }

  /**
   * Construye un prompt usando el template científico del .env
   * Reemplaza {user_query} con la consulta del usuario
   */
  private buildScientificStructuredPrompt(userQuery: string): string {
    // Obtener el template del .env
    const template = process.env.VERTEXAI_MESSAGE_TEMPLATE || '';
    
    if (!template) {
      this.logger.warn('VERTEXAI_MESSAGE_TEMPLATE not found in environment variables, using fallback');
      return `Based on the following query, generate a JSON response with the exact structure: answer, related_articles, and relationship_graph.\n\nQuery: ${userQuery}`;
    }

    // Reemplazar {user_query} con la consulta actual
    const enhancedPrompt = template.replace('{user_query}', userQuery);
    
    return enhancedPrompt;
  }

  /**
   * Extrae y parsea JSON de una respuesta de texto
   * Busca el primer bloque JSON válido en la respuesta
   */
  private extractAndParseJSON(text: string): any {
    // Limpiar el texto
    const cleanText = text.trim();
    
    // Intentar parsear directamente si parece ser JSON puro
    if (cleanText.startsWith('{') && cleanText.endsWith('}')) {
      try {
        return JSON.parse(cleanText);
      } catch (error) {
        // Si falla, continuar con la búsqueda de bloques JSON
      }
    }

    // Buscar bloques JSON en el texto (entre ```json y ``` o entre { y })
    const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/g;
    const jsonMatch = jsonBlockRegex.exec(cleanText);
    
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch (error) {
        this.logger.warn('Failed to parse JSON from code block');
      }
    }

    // Buscar el primer objeto JSON válido en el texto
    const jsonObjectRegex = /\{[\s\S]*\}/;
    const objectMatch = cleanText.match(jsonObjectRegex);
    
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch (error) {
        this.logger.warn('Failed to parse JSON object from text');
      }
    }

    throw new Error('No valid JSON found in response');
  }

  /**
   * Generates a title based on a previously generated response
   * Uses AI to create a concise, relevant title for the given content
   */
  async generateTitle(response: string): Promise<string> {
    const startTime = Date.now();
    const requestId = `title_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    try {
      this.logger.log(`[${requestId}] Generating title for response: ${response.substring(0, 100)}...`);

      const model = 'gemini-2.5-flash-lite';
      const temperature = 0.3; // Low temperature for consistent, focused titles
      const maxTokens = 100; // Short response for titles

      // Build prompt for title generation
      const titlePrompt = this.buildTitlePrompt(response);

      const generativeModel = this.vertexAI.preview.getGenerativeModel({
        model: model,
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          topP: 0.8,
          topK: 40,
        },
      });

      // Generate title
      const result = await generativeModel.generateContent(titlePrompt);
      const aiResponse = await result.response;
      const generatedTitle = aiResponse.candidates?.[0]?.content?.parts?.[0]?.text || 'Título no disponible';

      const endTime = Date.now();
      const processingTime = `${endTime - startTime}ms`;

      this.logger.log(`[${requestId}] Title generated successfully in ${processingTime}`);

      // Clean and format the title
      return this.cleanTitle(generatedTitle);

    } catch (error) {
      this.logger.error(`[${requestId}] Error generating title:`, error);
      
      // Fallback: generate a basic title from the first few words
      const fallbackTitle = this.generateFallbackTitle(response);
      return fallbackTitle;
    }
  }

  /**
   * Builds a prompt specifically for title generation
   */
  private buildTitlePrompt(response: string): string {
    const prompt = `Basándote en el siguiente contenido, genera un título conciso, descriptivo y atractivo que capture la esencia del tema principal. El título debe ser:

- Máximo 10-12 palabras
- Claro y específico
- Sin comillas ni caracteres especiales innecesarios
- En español
- Profesional y académico cuando corresponda

Contenido:
${response}

Genera SOLAMENTE el título, sin explicaciones adicionales:`;

    return prompt;
  }

  /**
   * Cleans and formats the generated title
   */
  private cleanTitle(title: string): string {
    // Remove quotes, extra spaces, and newlines
    let cleanedTitle = title
      .replace(/^["']|["']$/g, '') // Remove quotes at start/end
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();

    // Capitalize first letter
    if (cleanedTitle.length > 0) {
      cleanedTitle = cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1);
    }

    // Ensure it's not too long
    if (cleanedTitle.length > 120) {
      cleanedTitle = cleanedTitle.substring(0, 120).trim() + '...';
    }

    return cleanedTitle || 'Título Generado';
  }

  /**
   * Generates a fallback title from the content when AI generation fails
   */
  private generateFallbackTitle(response: string): string {
    // Take first meaningful words and create a basic title
    const words = response
      .split(' ')
      .filter(word => word.length > 2) // Filter short words
      .slice(0, 8) // Take first 8 words
      .join(' ');

    const fallbackTitle = words.charAt(0).toUpperCase() + words.slice(1);
    
    return fallbackTitle.length > 0 ? fallbackTitle : 'Resumen del Contenido';
  }
}
