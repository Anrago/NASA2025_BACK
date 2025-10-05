import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for generating a title based on a previous response
 */
export class TitleGenerationDto {
  @ApiProperty({
    description: 'The previously generated response/content to create a title for',
    example: 'The photosynthesis is a fundamental biological process that allows plants to convert sunlight into chemical energy. This process primarily occurs in the chloroplasts of leaves and involves the absorption of carbon dioxide from the air and water from the soil to produce glucose and oxygen.',
    maxLength: 5000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000, { message: 'La respuesta no puede exceder los 5000 caracteres' })
  response: string;
}

/**
 * Response DTO for title generation
 */
export class TitleResponseDto {
  @ApiProperty({
    description: 'The generated title for the provided response',
    example: 'Photosynthesis: The Vital Process of Converting Sunlight into Energy',
  })
  title: string;

  constructor(title: string) {
    this.title = title;
  }
}