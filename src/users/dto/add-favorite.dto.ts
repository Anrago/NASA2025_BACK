import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddFavoriteDto {
  @ApiProperty({
    description: 'Article title',
    example: 'Effects of Microgravity on Plant Growth',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Article publication year',
    example: 2023,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  year?: number;

  @ApiProperty({
    description: 'Article authors',
    example: ['John Doe', 'Jane Smith'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  authors?: string[];

  @ApiProperty({
    description: 'Article tags',
    example: ['microgravity', 'botany', 'space'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({
    description: 'Article DOI',
    example: '10.1038/nature12373',
    required: false,
  })
  @IsOptional()
  @IsString()
  doi?: string;
}
