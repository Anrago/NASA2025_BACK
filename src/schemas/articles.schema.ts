import { ApiProperty } from '@nestjs/swagger';

export class articles {
  @ApiProperty({
    description: 'The unique identifier of the article',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'The title of the article',
    example: 'Latest Mars Rover Findings',
  })
  title: string;

  @ApiProperty({
    description: 'The year the article was published',
    example: 2025,
  })
  year: Number;

  @ApiProperty({
    description: 'The author(s) of the article',
    example: ['John Doe', 'Jane Smith'],
  })
  author: string[];

  @ApiProperty({
    description: 'Tags associated with the article',
    example: ['Mars', 'Rover', 'NASA'],
  })
  tags: string[];
}
