import { Module } from '@nestjs/common';
import { VertexAIController } from './vertex-ai.controller';
import { VertexAIService } from './vertex-ai.service';
import { ContentProcessorService } from './content-processor.service';
import { RagService } from './rag.service';

/**
 * Module for Google Cloud VertexAI integration
 *
 * This module provides AI content generation capabilities using Google's
 * Gemini models through the VertexAI API. It includes endpoints for:
 * - Generating text content based on prompts
 * - Checking service health and connectivity
 *
 * @remarks
 * Requires proper Google Cloud authentication and VertexAI API to be enabled
 * in your Google Cloud project.
 *
 * Environment variables required:
 * - GOOGLE_CLOUD_PROJECT_ID: Your Google Cloud project ID
 * - GOOGLE_CLOUD_LOCATION: Region for VertexAI (e.g., 'us-central1')
 * - GOOGLE_APPLICATION_CREDENTIALS: Path to service account JSON key file
 */
@Module({
  controllers: [VertexAIController],
  providers: [VertexAIService, ContentProcessorService, RagService],
  exports: [VertexAIService, ContentProcessorService, RagService],
})
export class VertexAIModule {}
