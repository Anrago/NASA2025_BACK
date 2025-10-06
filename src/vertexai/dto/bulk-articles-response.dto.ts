import { ApiProperty } from '@nestjs/swagger';

export class BulkArticleDto {
  @ApiProperty({
    description: 'Title of the article',
    example: 'Effects of Microgravity on Plant Growth',
  })
  title: string;

  @ApiProperty({
    description: 'Publication year of the article',
    example: 2023,
    nullable: true,
  })
  year: number | null;

  @ApiProperty({
    description: 'List of authors',
    example: ['Smith, J.', 'Johnson, M.', 'Williams, K.'],
    type: [String],
  })
  authors: string[];

  @ApiProperty({
    description: 'Relevant tags/keywords for the article',
    example: ['microgravity', 'plant biology', 'space research'],
    type: [String],
  })
  tags: string[];
}

export class BulkArticlesResponseDto {
  @ApiProperty({
    description: 'Array of articles retrieved from the database',
    type: [BulkArticleDto],
  })
  articles: BulkArticleDto[];
}
