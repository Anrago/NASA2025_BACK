export interface AIResponseStructure {
  success: boolean;
  data: {
    response: string;
    model: string;
    promptTokens?: number;
    responseTokens?: number;
    totalTokens?: number;
    temperature: number;
    processingTime: string;
  };
  metadata: {
    requestId: string;
    timestamp: string;
    version: string;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export class AIResponseDto implements AIResponseStructure {
  success: boolean;
  data: {
    response: string;
    model: string;
    promptTokens?: number;
    responseTokens?: number;
    totalTokens?: number;
    temperature: number;
    processingTime: string;
  };
  metadata: {
    requestId: string;
    timestamp: string;
    version: string;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };

  constructor(
    success: boolean,
    response: string,
    model: string,
    temperature: number,
    processingTime: string,
    requestId?: string,
    tokenUsage?: {
      promptTokens?: number;
      responseTokens?: number;
      totalTokens?: number;
    },
    error?: {
      code: string;
      message: string;
      details?: any;
    }
  ) {
    this.success = success;
    this.data = {
      response,
      model,
      temperature,
      processingTime,
      ...tokenUsage,
    };
    this.metadata = {
      requestId: requestId || this.generateRequestId(),
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
    if (error) {
      this.error = error;
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}