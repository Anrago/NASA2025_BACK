import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveFavoriteDto {
  @ApiProperty({
    description: 'Article ID to remove from favorites',
    example: 'article123',
  })
  @IsString()
  @IsNotEmpty()
  articleId: string;
}
