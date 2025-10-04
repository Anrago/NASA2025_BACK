import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddFavoriteDto {
  @ApiProperty({
    description: 'Article ID to add to favorites',
    example: 'article123',
  })
  @IsString()
  @IsNotEmpty()
  articleId: string;
}
