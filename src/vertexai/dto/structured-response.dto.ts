export interface ContentSection {
  title: string;
  content: string;
  subsections?: ContentSection[];
  examples?: string[];
  keyPoints?: string[];
  codeSnippets?: CodeSnippet[];
}

export interface CodeSnippet {
  language: string;
  code: string;
  description?: string;
  filename?: string;
}

export interface StructuredContent {
  summary: string;
  mainTopic: string;
  sections: ContentSection[];
  keyTakeaways: string[];
  relatedTopics?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime?: string;
}

export interface PerformanceMetrics {
  processingTime: string;
  promptTokens: number;
  responseTokens: number;
  totalTokens: number;
  modelConfidence?: number;
  contentQuality?: number;
}

export interface RequestMetadata {
  requestId: string;
  timestamp: string;
  version: string;
  model: string;
  temperature: number;
  maxTokens: number;
  responseFormat: string;
  contentType: string;
}

export class StructuredResponseDto {
  success: boolean;
  
  data: {
    rawResponse: string;
    structuredContent: StructuredContent;
    performance: PerformanceMetrics;
  };
  
  metadata: RequestMetadata;
  
  error?: {
    code: string;
    message: string;
    details?: any;
    suggestions?: string[];
  };

  constructor(
    success: boolean,
    rawResponse: string,
    structuredContent: StructuredContent,
    performance: PerformanceMetrics,
    metadata: RequestMetadata,
    error?: {
      code: string;
      message: string;
      details?: any;
      suggestions?: string[];
    }
  ) {
    this.success = success;
    this.data = {
      rawResponse,
      structuredContent,
      performance,
    };
    this.metadata = metadata;
    if (error) {
      this.error = error;
    }
  }

  static createError(
    errorCode: string,
    errorMessage: string,
    metadata: RequestMetadata,
    performance: PerformanceMetrics,
    details?: any,
    suggestions?: string[]
  ): StructuredResponseDto {
    return new StructuredResponseDto(
      false,
      '',
      {
        summary: '',
        mainTopic: '',
        sections: [],
        keyTakeaways: [],
      },
      performance,
      metadata,
      {
        code: errorCode,
        message: errorMessage,
        details,
        suggestions,
      }
    );
  }
}