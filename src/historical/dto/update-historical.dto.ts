import { PartialType } from '@nestjs/swagger';
import { CreateHistoricalDto } from './create-historical.dto';

export class UpdateHistoricalDto extends PartialType(CreateHistoricalDto) {}
