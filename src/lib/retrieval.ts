import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { embedText } from '@/lib/openai';
import { chunkText } from '@/lib/chunk';

// This module holds the pgvector pieces that Prisma cannot express through its
// normal model API. Embeddings are written and searched with raw SQL.
//
// A pgvector literal looks like: '[0.12,0.34,...]'. We build that string from
// the number[] returned by OpenAI and cast it to ::vector in SQL.

const toVectorLiteral = (embedding: number[]): string =>
  `[${embedding.join(',')}]`;

export type RetrievedChunk = {
  text: string;
  filename: string;
  distance: number;
};

// Embed and store every chunk of a document. Called after a document is saved.
const indexDocument = async (
  documentId: string,
  content: string,
): Promise<number> => {
  const chunks = chunkText(content);

  for (const text of chunks) {
    const embedding = await embedText(text);
    const id = randomUUID();
    // Insert the row with its embedding in one raw statement.
    await prisma.$executeRaw`
      INSERT INTO "Chunk" ("id", "text", "embedding", "documentId", "createdAt")
      VALUES (${id}, ${text}, ${toVectorLiteral(embedding)}::vector, ${documentId}, NOW())
    `;
  }

  return chunks.length;
};

// Find the chunks most similar to a question, scoped to a single bot.
// Uses cosine distance (<=>) provided by pgvector; smaller = closer.
const searchChunks = async (
  botId: string,
  question: string,
  limit: number,
): Promise<RetrievedChunk[]> => {
  const embedding = await embedText(question);
  const vector = toVectorLiteral(embedding);

  const rows = await prisma.$queryRaw<RetrievedChunk[]>`
    SELECT c."text" AS "text",
           d."filename" AS "filename",
           (c."embedding" <=> ${vector}::vector) AS "distance"
    FROM "Chunk" c
    JOIN "Document" d ON d."id" = c."documentId"
    WHERE d."botId" = ${botId}
      AND c."embedding" IS NOT NULL
    ORDER BY c."embedding" <=> ${vector}::vector
    LIMIT ${Prisma.raw(String(Math.trunc(limit)))}
  `;

  return rows;
};

export const retrieval = {
  indexDocument,
  searchChunks,
};
