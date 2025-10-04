export class VertexAIResponseDto {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  timestamp: string;

  constructor(success: boolean, data?: any, error?: string, message?: string) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}