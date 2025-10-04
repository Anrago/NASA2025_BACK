import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for generating a title based on a previous response
 */
export class TitleGenerationDto {
  @ApiProperty({
    description: 'The previously generated response/content to create a title for',
    example: 'La fotosíntesis es un proceso biológico fundamental que permite a las plantas convertir la luz solar en energía química. Este proceso ocurre principalmente en los cloroplastos de las hojas y involucra la absorción de dióxido de carbono del aire y agua del suelo para producir glucosa y oxígeno.',
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
    example: 'Fotosíntesis: El Proceso Vital de Conversión de Luz Solar en Energía'
  })
  title: string;

  constructor(title: string) {
    this.title = title;
  }
}