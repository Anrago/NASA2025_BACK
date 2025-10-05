import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);
  private projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  private location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central4';
  private model = process.env.GOOGLE_CLOUD_RAG_MODEL || 'gemini-2.5-flash-lite';
  private ragCorpus = process.env.GOOGLE_CLOUD_RAG_CORPUS || 'your-corpus-id';
  private ragCorpusPath = `projects/${this.projectId}/locations/${this.location}/ragCorpora/${this.ragCorpus}`;

  private authClient: GoogleAuth;

  constructor() {
    this.authClient = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
  }

  async generateWithRetrieval(userPrompt: string): Promise<string> {
    // Get access token using ADC
    const client = await this.authClient.getClient();
    const accessToken = (await client.getAccessToken()).token;

    if (!accessToken) {
      throw new Error('Failed to get access token via ADC');
    }

    const url = `https://${this.location}-aiplatform.googleapis.com/v1beta1/projects/${this.projectId}/locations/${this.location}/publishers/google/models/${this.model}:generateContent`;

    const body = {
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      tools: {
        retrieval: {
          vertex_rag_store: {
            rag_resources: { rag_corpus: this.ragCorpusPath },
            similarity_top_k: 3,
          },
        },
      },
    };

    try {
      const resp = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });


      // Check for error in response
      if (resp.data.error) {
        this.logger.error('Vertex AI API error:', resp.data.error);
        throw new Error(
          `Vertex AI API error: ${resp.data.error.message || 'Unknown error'}`,
        );
      }

      // Check for candidates array (common Gemini response format)
      if (resp.data.candidates && resp.data.candidates.length > 0) {
        const candidate = resp.data.candidates[0];
        if (candidate.content && candidate.content.parts) {
          return candidate.content.parts.map((p: any) => p.text).join('');
        }
      }

      // Check for contents array (alternative format)
      if (resp.data?.contents?.[0]?.parts) {
        return resp.data.contents[0].parts.map((p: any) => p.text).join('');
      }

      // Log unexpected structure and throw detailed error
      this.logger.error(
        'Unexpected response structure. Full response:',
        JSON.stringify(resp.data, null, 2),
      );
      throw new Error(
        `Unexpected Vertex AI response format. Response keys: ${Object.keys(resp.data || {}).join(', ')}`,
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error('Axios error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        throw new Error(
          `Vertex AI API request failed: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`,
        );
      }
      throw error;
    }
  }

  /**
   * Generates structured content using RAG with the same format as vertex-ai structured-simple
   * Returns JSON with answer, related_articles, and relationship_graph
   */

  async generateStructuredWithRetrieval(userPrompt: string): Promise<any> {
    // Get access token using ADC
    const client = await this.authClient.getClient();
    const accessToken = (await client.getAccessToken()).token;

    if (!accessToken) {
      throw new Error('Failed to get access token via ADC');
    }
    const url = `https://${this.location}-aiplatform.googleapis.com/v1beta1/projects/${this.projectId}/locations/${this.location}/publishers/google/models/${this.model}:generateContent`;

    const prompt = process.env.VERTEXAI_MESSAGE_TEMPLATE || '';

    if (prompt) {
      userPrompt = prompt.replace('{user_prompt}', userPrompt);
    }

    const body = {
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      tools: {
        retrieval: {
          vertex_rag_store: {
            rag_resources: { rag_corpus: this.ragCorpusPath },
            similarity_top_k: 6,
          },
        },
      },
    };

    let response: any;

    try {
      response = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      this.logger.debug(
        'Full RAG structured response:',
        JSON.stringify(response.data, null, 2),
      );

      let responseText = '';

      if (response.data.candidates && response.data.candidates.length > 0) {
        const candidate = response.data.candidates[0];
        if (candidate.content && candidate.content.parts) {
          responseText = candidate.content.parts.map((p: any) => p.text).join('');
        }
      }

      // Check for contents array (alternative format)
      if (!responseText && response.data?.contents?.[0]?.parts) {
        responseText = response.data.contents[0].parts
          .map((p: any) => p.text)
          .join('');
      }

      if (!responseText) {
        this.logger.error(
          'No response text found. Full response:',
          JSON.stringify(response.data, null, 2),
        );
        throw new Error(
          `No response text in RAG response. Response keys: ${Object.keys(response.data || {}).join(', ')}`,
        );
      }

      // Parse the JSON response
      try {
        const parsedResponse = this.extractAndParseJSON(responseText);

        // Validate that it has the required structure
        if (
          parsedResponse &&
          parsedResponse.answer &&
          parsedResponse.related_articles &&
          parsedResponse.relationship_graph
        ) {
          return parsedResponse;
        } else {
          this.logger.warn('Invalid structured response, returning fallback');
          return {
            answer: responseText,
            related_articles: [],
            relationship_graph: { nodes: [], links: [] },
          };
        }
      } catch (parseError) {
        this.logger.warn(
          `Could not parse RAG JSON response: ${parseError.message}`,
        );
        return {
          answer: responseText,
          related_articles: [],
          relationship_graph: { nodes: [], links: [] },
        };
      }
    } catch (error) {
      this.logger.error(
        'Error generating structured content with retrieval:',
        error,
      );

      if (axios.isAxiosError(error)) {
        this.logger.error('RAG structured request failed:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        throw new Error(
          `RAG API request failed: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`,
        );
      }
      throw error;
    }
  }

  private extractAndParseJSON(text: string): any {
    // Clean the text
    const cleanText = text.trim();

    // Try to parse directly if it looks like pure JSON
    if (cleanText.startsWith('{') && cleanText.endsWith('}')) {
      try {
        return JSON.parse(cleanText);
      } catch (error) {
        // Continue with block search if direct parsing fails
      }
    }

    // Look for JSON blocks in the text (between ```json and ``` or between { and })
    const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/g;
    const jsonMatch = jsonBlockRegex.exec(cleanText);

    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch (error) {
        this.logger.warn('Failed to parse JSON from code block');
      }
    }

    // Look for the first valid JSON object in the text
    const jsonObjectRegex = /\{[\s\S]*\}/;
    const objectMatch = cleanText.match(jsonObjectRegex);

    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch (error) {
        this.logger.warn('Failed to parse JSON object from text');
      }
    }

    throw new Error('No valid JSON found in RAG response');
  }
}
