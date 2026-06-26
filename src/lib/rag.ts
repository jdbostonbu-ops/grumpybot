import { openai, CHAT_MODEL } from '@/lib/openai';
import { retrieval, type RetrievedChunk } from '@/lib/retrieval';

const TOP_K = 4;

export type GroundedAnswer = {
  answer: string;
  sources: string[];
};

// The system prompt enforces the assignment's core rule: answer ONLY from the
// provided context. If the answer is not in the context, the bot must say so
// rather than invent anything.
const SYSTEM_PROMPT = [
  'You are a helpful assistant for a specific business.',
  'Answer the user\'s question using ONLY the context provided below.',
  'The context is drawn from the business\'s own documents.',
  'If the answer is not contained in the context, say you could not find it',
  'in the documents and do not make anything up.',
  'Do not use outside knowledge. Match the tone of the documents.',
].join(' ');

const buildContext = (chunks: RetrievedChunk[]): string =>
  chunks
    .map(
      (chunk, index) =>
        `[Source ${index + 1}: ${chunk.filename}]\n${chunk.text}`,
    )
    .join('\n\n');

const uniqueSources = (chunks: RetrievedChunk[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const chunk of chunks) {
    if (!seen.has(chunk.filename)) {
      seen.add(chunk.filename);
      result.push(chunk.filename);
    }
  }
  return result;
};

const answerQuestion = async (
  botId: string,
  question: string,
): Promise<GroundedAnswer> => {
  const chunks = await retrieval.searchChunks(botId, question, TOP_K);

  if (chunks.length === 0) {
    return {
      answer:
        'I could not find anything about that in the documents, so I cannot answer it.',
      sources: [],
    };
  }

  const context = buildContext(chunks);

  const response = await openai.getClient().chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Context:\n${context}\n\nQuestion: ${question}`,
      },
    ],
  });

  const answer =
    response.choices[0].message.content ??
    'I could not produce an answer from the documents.';

  return { answer, sources: uniqueSources(chunks) };
};

export const rag = {
  answerQuestion,
};
