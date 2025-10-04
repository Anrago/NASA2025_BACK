import { Module } from '@nestjs/common';
import { VertexAIController } from './vertex-ai.controller';
import { VertexAIService } from './vertex-ai.service';

@Module({
  controllers: [VertexAIController],
  providers: [VertexAIService],
  exports: [VertexAIService],
})
export class VertexAIModule {}