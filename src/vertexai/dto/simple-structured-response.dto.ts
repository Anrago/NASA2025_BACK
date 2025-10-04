export interface StructuredArticle {
  title: string;
  year: number;
  authors: string[];
  tags: string[];
}

export interface StructuredGraphNode {
  id: string; // article title
  is_central_node: boolean;
}

export interface StructuredGraphEdge {
  source: string; // central node title
  target: string; // other node title
}

export interface StructuredRelationshipGraph {
  nodes: StructuredGraphNode[];
  edges: StructuredGraphEdge[];
}

export interface StructuredResponseData {
  answer: string;
  related_articles: StructuredArticle[];
  relationship_graph: StructuredRelationshipGraph;
}

export class SimpleStructuredResponseDto implements StructuredResponseData {
  answer: string;
  related_articles: StructuredArticle[];
  relationship_graph: StructuredRelationshipGraph;

  constructor(
    answer: string,
    related_articles: StructuredArticle[],
    relationship_graph: StructuredRelationshipGraph
  ) {
    this.answer = answer;
    this.related_articles = related_articles;
    this.relationship_graph = relationship_graph;
  }

  static createMockResponse(answer: string): SimpleStructuredResponseDto {
    // Crear respuesta mock con artículos generados automáticamente
    const mockArticles: StructuredArticle[] = [
      {
        title: "AI and Machine Learning: Current Trends",
        year: 2023,
        authors: ["Smith, J.", "Johnson, A."],
        tags: ["artificial intelligence", "machine learning", "trends"]
      },
      {
        title: "Natural Language Processing Advances",
        year: 2024,
        authors: ["Brown, L.", "Davis, M."],
        tags: ["NLP", "language models", "processing"]
      },
      {
        title: "Deep Learning Applications",
        year: 2022,
        authors: ["Wilson, R.", "Taylor, K."],
        tags: ["deep learning", "neural networks", "applications"]
      },
      {
        title: "Computer Vision Technologies",
        year: 2023,
        authors: ["Anderson, P.", "Martinez, C."],
        tags: ["computer vision", "image processing", "technology"]
      }
    ];

    const mockGraph: StructuredRelationshipGraph = {
      nodes: [
        {
          id: "AI and Machine Learning: Current Trends",
          is_central_node: true
        },
        {
          id: "Natural Language Processing Advances",
          is_central_node: false
        },
        {
          id: "Deep Learning Applications", 
          is_central_node: false
        },
        {
          id: "Computer Vision Technologies",
          is_central_node: false
        }
      ],
      edges: [
        {
          source: "AI and Machine Learning: Current Trends",
          target: "Natural Language Processing Advances"
        },
        {
          source: "AI and Machine Learning: Current Trends", 
          target: "Deep Learning Applications"
        },
        {
          source: "AI and Machine Learning: Current Trends",
          target: "Computer Vision Technologies"
        }
      ]
    };

    return new SimpleStructuredResponseDto(answer, mockArticles, mockGraph);
  }
}