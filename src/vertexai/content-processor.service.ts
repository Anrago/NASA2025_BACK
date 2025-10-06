import { Injectable, Logger } from '@nestjs/common';
import {
  StructuredContent,
  ContentSection,
  CodeSnippet,
} from './dto/structured-response.dto';

@Injectable()
export class ContentProcessorService {
  private readonly logger = new Logger(ContentProcessorService.name);

  /**
   * Procesa el texto crudo y lo estructura en secciones
   */
  async processContent(
    rawText: string,
    contentType: string,
    includeExamples?: boolean,
  ): Promise<StructuredContent> {
    try {
      // Detectar el tema principal
      const mainTopic = this.extractMainTopic(rawText);

      // Generar resumen
      const summary = this.generateSummary(rawText);

      // Dividir en secciones
      const sections = this.extractSections(
        rawText,
        contentType,
        includeExamples,
      );

      // Extraer puntos clave
      const keyTakeaways = this.extractKeyTakeaways(rawText);

      // Detectar topics relacionados
      const relatedTopics = this.extractRelatedTopics(rawText);

      // Estimar dificultad
      const difficulty = this.estimateDifficulty(rawText);

      // Calcular tiempo de lectura
      const estimatedReadTime = this.calculateReadTime(rawText);

      return {
        summary,
        mainTopic,
        sections,
        keyTakeaways,
        relatedTopics,
        difficulty,
        estimatedReadTime,
      };
    } catch (error) {
      this.logger.error('Error processing content:', error);

      // Retornar estructura básica en caso de error
      return {
        summary: rawText.substring(0, 200) + '...',
        mainTopic: 'Contenido generado',
        sections: [
          {
            title: 'Respuesta',
            content: rawText,
          },
        ],
        keyTakeaways: [],
      };
    }
  }

  private extractMainTopic(text: string): string {
    // Buscar patrones comunes de títulos o temas principales
    const lines = text.split('\n').filter((line) => line.trim().length > 0);

    // Buscar líneas que parezcan títulos (cortas, al inicio, etc.)
    for (const line of lines.slice(0, 3)) {
      if (line.length < 100 && line.length > 10) {
        return line.trim().replace(/^[#*\-\s]+/, '');
      }
    }

    // Si no encuentra un título claro, usar las primeras palabras
    const firstSentence = text.split('.')[0];
    return firstSentence.length > 100 ? 'Tema principal' : firstSentence.trim();
  }

  private generateSummary(text: string): string {
    // Tomar las primeras 2-3 oraciones como resumen
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
    const summaryLength = Math.min(3, sentences.length);
    return sentences.slice(0, summaryLength).join('. ').trim() + '.';
  }

  private extractSections(
    text: string,
    contentType: string,
    includeExamples?: boolean,
  ): ContentSection[] {
    const sections: ContentSection[] = [];

    // Dividir por patrones comunes de secciones
    const sectionPatterns = [
      /^#{1,6}\s+(.+)$/gm, // Markdown headers
      /^(\d+\.\s+.+)$/gm, // Numbered lists
      /^([A-Z][^.!?]*:)\s*$/gm, // Titles with colons
      /^(\*\*[^*]+\*\*)/gm, // Bold text as headers
    ];

    let remainingText = text;
    let currentSection: ContentSection | null = null;

    const lines = text.split('\n');
    let currentContent = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Detectar si es un título de sección
      if (this.isHeaderLine(line)) {
        // Guardar la sección anterior si existe
        if (currentSection) {
          currentSection.content = currentContent.trim();
          if (includeExamples) {
            currentSection.examples = this.extractExamples(currentContent);
          }
          currentSection.keyPoints =
            this.extractKeyPointsFromSection(currentContent);
          currentSection.codeSnippets =
            this.extractCodeSnippets(currentContent);
          sections.push(currentSection);
        }

        // Crear nueva sección
        currentSection = {
          title: this.cleanTitle(line),
          content: '',
        };
        currentContent = '';
      } else {
        currentContent += line + '\n';
      }
    }

    // Agregar la última sección
    if (currentSection) {
      currentSection.content = currentContent.trim();
      if (includeExamples) {
        currentSection.examples = this.extractExamples(currentContent);
      }
      currentSection.keyPoints =
        this.extractKeyPointsFromSection(currentContent);
      currentSection.codeSnippets = this.extractCodeSnippets(currentContent);
      sections.push(currentSection);
    }

    // Si no se encontraron secciones, crear una sección principal
    if (sections.length === 0) {
      sections.push({
        title: 'Contenido Principal',
        content: text,
        keyPoints: this.extractKeyPointsFromSection(text),
        codeSnippets: this.extractCodeSnippets(text),
        examples: includeExamples ? this.extractExamples(text) : undefined,
      });
    }

    return sections;
  }

  private isHeaderLine(line: string): boolean {
    return (
      !!line.match(/^#{1,6}\s+/) || // Markdown headers
      !!line.match(/^\d+\.\s+[A-Z]/) || // Numbered headers
      !!line.match(/^[A-Z][^.!?]*:$/) || // Title with colon
      !!line.match(/^\*\*[^*]+\*\*$/) || // Bold titles
      (line.length < 60 && line.length > 5 && !!line.match(/^[A-Z]/)) // Short capitalized lines
    );
  }

  private cleanTitle(title: string): string {
    return title
      .replace(/^#+\s*/, '') // Remove markdown headers
      .replace(/^\*\*|\*\*$/, '') // Remove bold markers
      .replace(/^\d+\.\s*/, '') // Remove numbering
      .replace(/:$/, '') // Remove trailing colon
      .trim();
  }

  private extractKeyTakeaways(text: string): string[] {
    const keyTakeaways: string[] = [];

    // Buscar listas con puntos importantes
    const bulletPoints = text.match(/^[\-\*\+]\s+(.+)$/gm);
    if (bulletPoints) {
      keyTakeaways.push(
        ...bulletPoints.map((point) => point.replace(/^[\-\*\+]\s+/, '')),
      );
    }

    // Buscar oraciones que parecen conclusiones
    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (sentence.length > 20 && sentence.length < 150) {
        const lower = sentence.toLowerCase();
        if (
          lower.includes('importante') ||
          lower.includes('clave') ||
          lower.includes('esencial') ||
          lower.includes('fundamental') ||
          lower.includes('recordar')
        ) {
          keyTakeaways.push(sentence.trim());
        }
      }
    }

    return keyTakeaways.slice(0, 5); // Máximo 5 puntos clave
  }

  private extractRelatedTopics(text: string): string[] {
    const topics: string[] = [];

    // Buscar patrones que indiquen topics relacionados
    const relatedPatterns = [
      /relacionado con\s+([^.!?]+)/gi,
      /también\s+([^.!?]+)/gi,
      /similar a\s+([^.!?]+)/gi,
    ];

    for (const pattern of relatedPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        topics.push(
          ...matches.map((match) =>
            match.replace(pattern, '$1').trim().substring(0, 50),
          ),
        );
      }
    }

    return [...new Set(topics)].slice(0, 5);
  }

  private extractKeyPointsFromSection(text: string): string[] {
    const points: string[] = [];

    // Buscar listas numeradas o con bullets
    const listItems = text.match(/^[\d\-\*\+]\s*\.?\s*(.+)$/gm);
    if (listItems) {
      points.push(
        ...listItems.map((item) =>
          item.replace(/^[\d\-\*\+]\s*\.?\s*/, '').trim(),
        ),
      );
    }

    return points.slice(0, 5);
  }

  private extractExamples(text: string): string[] {
    const examples: string[] = [];

    // Buscar patrones que indiquen ejemplos
    const examplePatterns = [
      /ejemplo[:\s]+([^.!?]+[.!?])/gi,
      /por ejemplo[:\s]+([^.!?]+[.!?])/gi,
      /como[:\s]+([^.!?]+[.!?])/gi,
    ];

    for (const pattern of examplePatterns) {
      const matches = text.match(pattern);
      if (matches) {
        examples.push(...matches.map((match) => match.trim()));
      }
    }

    return examples.slice(0, 3);
  }

  private extractCodeSnippets(text: string): CodeSnippet[] {
    const snippets: CodeSnippet[] = [];

    // Buscar bloques de código markdown
    const codeBlocks = text.match(/```(\w+)?\n([\s\S]*?)```/g);
    if (codeBlocks) {
      for (const block of codeBlocks) {
        const match = block.match(/```(\w+)?\n([\s\S]*?)```/);
        if (match) {
          snippets.push({
            language: match[1] || 'text',
            code: match[2].trim(),
            description: 'Ejemplo de código',
          });
        }
      }
    }

    // Buscar código inline
    const inlineCode = text.match(/`([^`]+)`/g);
    if (inlineCode && inlineCode.length > 0) {
      for (const code of inlineCode.slice(0, 3)) {
        snippets.push({
          language: 'text',
          code: code.replace(/`/g, ''),
          description: 'Código inline',
        });
      }
    }

    return snippets;
  }

  private estimateDifficulty(
    text: string,
  ): 'beginner' | 'intermediate' | 'advanced' {
    const complexWords = text.match(/\b\w{10,}\b/g)?.length || 0;
    const technicalTerms =
      text.match(
        /\b(algoritmo|implementación|arquitectura|optimización|refactoring|debugging)\b/gi,
      )?.length || 0;
    const codeBlocks = text.match(/```[\s\S]*?```/g)?.length || 0;

    const complexityScore = complexWords + technicalTerms * 2 + codeBlocks * 3;

    if (complexityScore > 15) return 'advanced';
    if (complexityScore > 7) return 'intermediate';
    return 'beginner';
  }

  private calculateReadTime(text: string): string {
    const wordsPerMinute = 200; // Promedio de lectura
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);

    if (minutes === 1) return '1 minuto';
    if (minutes < 60) return `${minutes} minutos`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 1 && remainingMinutes === 0) return '1 hora';
    if (remainingMinutes === 0) return `${hours} horas`;

    return `${hours}h ${remainingMinutes}m`;
  }
}
