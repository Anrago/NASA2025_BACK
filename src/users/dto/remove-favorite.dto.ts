import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveFavoriteDto {
  @ApiProperty({
    description: 'Article title to remove from favorites',
    example: 'Effects of Microgravity on Plant Growth',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
