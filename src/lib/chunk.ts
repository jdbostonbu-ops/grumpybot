// Split a document's text into chunks for embedding.
// Simple, predictable paragraph-aware splitting: group paragraphs until a size
// budget is reached. Minimal by design — good enough for handbook-style docs.

const MAX_CHARS = 800;

export const chunkText = (text: string): string[] => {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  const chunks: string[] = [];
  let current = '';

  for (const paragraph of paragraphs) {
    if (current === '') {
      current = paragraph;
    } else if (current.length + paragraph.length + 2 <= MAX_CHARS) {
      current = `${current}\n\n${paragraph}`;
    } else {
      chunks.push(current);
      current = paragraph;
    }
  }

  if (current !== '') {
    chunks.push(current);
  }

  return chunks;
};
