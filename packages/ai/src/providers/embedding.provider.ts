import { OpenAIEmbeddings } from '@langchain/openai';

export interface IEmbeddingProvider {
  name: string;
  dimension: number;
  embedText(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
  computeSimilarity(vecA: number[], vecB: number[]): number;
}

/**
 * Multilingual Local Embedding Provider
 * Computes deterministic multi-dimensional normalized vectors supporting multilingual and Hindi/Hinglish token spaces.
 * Functions as an offline fallback when cloud embedding API keys are not available.
 */
export class MultilingualLocalEmbeddingProvider implements IEmbeddingProvider {
  name = 'local-multilingual-embedder';
  dimension = 1536;

  async embedText(text: string): Promise<number[]> {
    return this.generateDeterministicVector(text, this.dimension);
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map(t => this.embedText(t)));
  }

  computeSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private generateDeterministicVector(text: string, dim: number): number[] {
    const vector = new Array(dim).fill(0);
    const normalized = text.toLowerCase().trim();
    const tokens = normalized.split(/[\s,._\-:;/()]+/);

    tokens.forEach((token, tokenIdx) => {
      if (!token) return;
      for (let i = 0; i < token.length; i++) {
        const charCode = token.charCodeAt(i);
        const index1 = (charCode * 31 + i * 17 + tokenIdx * 13) % dim;
        const index2 = (charCode * 79 + i * 23 + tokenIdx * 29) % dim;
        const weight = 1.0 / (1.0 + Math.log(tokenIdx + 1));
        vector[index1] += Math.sin(charCode + i) * weight;
        vector[index2] += Math.cos(charCode * 1.5 + tokenIdx) * weight;
      }
    });

    // L2 Normalize
    let sumSq = 0;
    for (let i = 0; i < dim; i++) {
      sumSq += vector[i] * vector[i];
    }
    const norm = Math.sqrt(sumSq) || 1.0;
    for (let i = 0; i < dim; i++) {
      vector[i] = vector[i] / norm;
    }

    return vector;
  }
}

/**
 * OpenAI / Hosted Multilingual Embedding Provider with automatic fallback
 */
export class OpenAIEmbeddingProvider implements IEmbeddingProvider {
  name = 'openai-embeddings';
  dimension = 1536;
  private fallback = new MultilingualLocalEmbeddingProvider();

  private getEmbedder(): OpenAIEmbeddings | null {
    const provider = (process.env.EMBEDDING_PROVIDER || '').toLowerCase();
    if (provider === 'local-multilingual') return null;

    if (provider === 'openrouter' || process.env.OPENROUTER_API_KEY) {
      const openrouterKey = process.env.OPENROUTER_API_KEY;
      if (openrouterKey && !openrouterKey.includes('your_openrouter_key') && openrouterKey.trim().length > 10) {
        return new OpenAIEmbeddings({
          openAIApiKey: openrouterKey,
          modelName: process.env.OPENROUTER_EMBEDDING_MODEL || 'nvidia/nemotron-3-embed-1b:free',
          configuration: {
            baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'
          }
        });
      }
    }

    const apiKey = process.env.EMBEDDING_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.includes('your_openai_api_key_here')) return null;

    return new OpenAIEmbeddings({
      openAIApiKey: apiKey,
      modelName: process.env.EMBEDDING_MODEL || 'text-embedding-3-small'
    });
  }

  async embedText(text: string): Promise<number[]> {
    const embedder = this.getEmbedder();
    if (!embedder) return this.fallback.embedText(text);

    try {
      return await embedder.embedQuery(text);
    } catch (err) {
      console.warn('[OpenAIEmbeddingProvider] Error calling OpenAI Embeddings API, falling back to local embedder:', err);
      return this.fallback.embedText(text);
    }
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    const embedder = this.getEmbedder();
    if (!embedder) return this.fallback.embedBatch(texts);

    try {
      return await embedder.embedDocuments(texts);
    } catch (err) {
      console.warn('[OpenAIEmbeddingProvider] Error batch calling OpenAI Embeddings API, falling back to local embedder:', err);
      return this.fallback.embedBatch(texts);
    }
  }

  computeSimilarity(vecA: number[], vecB: number[]): number {
    return this.fallback.computeSimilarity(vecA, vecB);
  }
}

export function getEmbeddingProvider(): IEmbeddingProvider {
  const provider = (process.env.EMBEDDING_PROVIDER || '').toLowerCase();
  if (provider === 'local-multilingual') {
    return new MultilingualLocalEmbeddingProvider();
  }
  return new OpenAIEmbeddingProvider();
}
