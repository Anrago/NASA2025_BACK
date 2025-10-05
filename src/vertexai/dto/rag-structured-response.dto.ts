import { ApiProperty } from '@nestjs/swagger';

export interface RagResearchGap {
  topic: string;
  description: string;
}

export interface RagStructuredArticle {
  title: string;
  year: number;
  authors: string[];
  tags: string[];
}

export interface RagGraphNode {
  id: string;
  name: string;
  group: string;
  title?: string;
  year?: number;
  authors?: string[];
  summary?: string;
  doi?: string;
  type?: 'article' | 'gap';
}

export interface RagGraphLink {
  source: string;
  target: string;
  value: number;
}

export interface RagGraphData {
  nodes: RagGraphNode[];
  links: RagGraphLink[];
}

export class RagStructuredResponseDto {
  @ApiProperty({
    description: 'The generated comprehensive answer',
    example: 'La fotosíntesis es un proceso biológico fundamental...',
  })
  answer: string;

  @ApiProperty({
    description: 'Array of related scientific articles',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Photosynthesis in Space Environments',
        },
        year: { type: 'number', example: 2023 },
        authors: {
          type: 'array',
          items: { type: 'string' },
          example: ['Smith, J.', 'Johnson, A.'],
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          example: ['photosynthesis', 'space', 'biology'],
        },
      },
    },
  })
  related_articles: RagStructuredArticle[];

  @ApiProperty({
    description:
      'Graph structure showing relationships between articles and concepts',
    type: 'object',
    properties: {
      nodes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'space-photosynthesis' },
            name: { type: 'string', example: 'Photosynthesis in Space' },
            group: { type: 'string', example: 'Biology' },
          },
        },
      },
      links: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            source: { type: 'string', example: 'space-photosynthesis' },
            target: { type: 'string', example: 'plant-biology' },
            value: { type: 'number', example: 3 },
          },
        },
      },
    },
  })
  relationship_graph: RagGraphData;

  @ApiProperty({
    description: 'Identified research gaps and underexplored areas',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          example: 'Long-term plant adaptation in microgravity',
        },
        description: {
          type: 'string',
          example:
            'Limited studies on how plants adapt to prolonged exposure to microgravity environments beyond 6 months',
        },
      },
    },
  })
  research_gaps: RagResearchGap[];

  constructor(
    answer: string,
    related_articles: RagStructuredArticle[],
    relationship_graph: RagGraphData,
    research_gaps: RagResearchGap[],
  ) {
    this.answer = answer;
    this.related_articles = related_articles;
    this.relationship_graph = relationship_graph;
    this.research_gaps = research_gaps;
  }

  static createMockResponse(answer: string): RagStructuredResponseDto {
    const mockArticles: RagStructuredArticle[] = [
      {
        title: 'Microgravity Effects on Plant Growth',
        year: 2023,
        authors: ['Martinez, L.', 'Thompson, R.'],
        tags: ['microgravity', 'plant biology', 'space agriculture'],
      },
      {
        title: 'Space-Based Agricultural Systems',
        year: 2024,
        authors: ['Chen, W.', 'Anderson, K.'],
        tags: ['agriculture', 'space missions', 'sustainability'],
      },
      {
        title: 'Photosynthesis in Controlled Environments',
        year: 2022,
        authors: ['Brown, S.', 'Wilson, M.'],
        tags: ['photosynthesis', 'controlled environment', 'LED lighting'],
      },
    ];

    const mockGraph: RagGraphData = {
      nodes: [
        {
          id: 'microgravity-plants',
          name: 'Microgravity Effects on Plants',
          group: 'Space Biology',
        },
        {
          id: 'space-agriculture',
          name: 'Space-Based Agricultural Systems',
          group: 'Agriculture',
        },
        {
          id: 'controlled-photosynthesis',
          name: 'Photosynthesis in Controlled Environments',
          group: 'Plant Science',
        },
        {
          id: 'research-gap-adaptation',
          name: 'Long-term Plant Adaptation',
          group: 'Research Gap',
        },
      ],
      links: [
        {
          source: 'microgravity-plants',
          target: 'space-agriculture',
          value: 4,
        },
        {
          source: 'space-agriculture',
          target: 'controlled-photosynthesis',
          value: 3,
        },
        {
          source: 'microgravity-plants',
          target: 'research-gap-adaptation',
          value: 2,
        },
      ],
    };

    const mockResearchGaps: RagResearchGap[] = [
      {
        topic: 'Long-term plant adaptation in microgravity',
        description:
          'Limited studies on how plants adapt to prolonged exposure to microgravity environments beyond 6 months',
      },
      {
        topic: 'Plant reproduction in space conditions',
        description:
          'Insufficient research on complete plant life cycles and seed production in space environments',
      },
      {
        topic: 'Closed-loop agricultural systems efficiency',
        description:
          'Lack of comprehensive data on resource efficiency in completely closed agricultural systems for space missions',
      },
    ];

    return new RagStructuredResponseDto(
      answer,
      mockArticles,
      mockGraph,
      mockResearchGaps,
    );
  }
}
