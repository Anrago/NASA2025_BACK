import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoricalService } from './historical.service';
import { HistoricalController } from './historical.controller';
import { Historical, HistoricalSchema } from '../schemas/historical.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Historical.name, schema: HistoricalSchema },
    ]),
  ],
  controllers: [HistoricalController],
  providers: [HistoricalService],
  exports: [HistoricalService],
})
export class HistoricalModule {}
