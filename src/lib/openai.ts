import OpenAI from 'openai';
import { env } from '@/lib/env';

// Models are named here so they are easy to change in one place later.
export const CHAT_MODEL = 'gpt-4o-mini';
export const EMBEDDING_MODEL = 'text-embedding-3-small';
export const EMBEDDING_DIMENSIONS = 1536;

const createClient = (): OpenAI => new OpenAI({ apiKey: env.openaiApiKey });

let client: OpenAI | undefined;

const getClient = (): OpenAI => {
  if (client === undefined) {
    client = createClient();
  }
  return client;
};

// Turn a single piece of text into an embedding vector.
export const embedText = async (text: string): Promise<number[]> => {
  const response = await getClient().embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return response.data[0].embedding;
};

export const openai = {
  getClient,
  embedText,
};
