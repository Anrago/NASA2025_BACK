export interface StructuredArticle {
  title: string;
  year: number;
  authors: string[];
  tags: string[];
}

// Frontend-compatible graph interfaces
export interface GraphNode {
  id: string;
  name: string;
  group: string;
}

export interface GraphLink {
  source: string;
  target: string;
  value: number;
}

export interface FrontendGraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Legacy interfaces for backward compatibility
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
  relationship_graph: FrontendGraphData;
}

export class SimpleStructuredResponseDto implements StructuredResponseData {
  answer: string;
  related_articles: StructuredArticle[];
  relationship_graph: FrontendGraphData;

  constructor(
    answer: string,
    related_articles: StructuredArticle[],
    relationship_graph: FrontendGraphData
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

    const mockGraph: FrontendGraphData = {
      nodes: [
        {
          id: "ai-machine-learning",
          name: "AI and Machine Learning: Current Trends",
          group: "AI"
        },
        {
          id: "nlp-advances",
          name: "Natural Language Processing Advances",
          group: "AI"
        },
        {
          id: "deep-learning",
          name: "Deep Learning Applications",
          group: "AI"
        },
        {
          id: "computer-vision",
          name: "Computer Vision Technologies",
          group: "AI"
        }
      ],
      links: [
        {
          source: "ai-machine-learning",
          target: "nlp-advances",
          value: 3
        },
        {
          source: "ai-machine-learning",
          target: "deep-learning",
          value: 4
        },
        {
          source: "ai-machine-learning",
          target: "computer-vision",
          value: 2
        },
        {
          source: "nlp-advances",
          target: "deep-learning",
          value: 2
        }
      ]
    };

    return new SimpleStructuredResponseDto(answer, mockArticles, mockGraph);
  }
}