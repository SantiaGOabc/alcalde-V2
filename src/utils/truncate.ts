/** Cuts at the last space to avoid breaking a word. */
const WORD_BOUNDARY = /\s\S*$/;
/** First period closing a sentence ("end. Next..."), not an abbreviation. */
const SENTENCE_END = /\.\s/;

/**
 * Truncates or summarizes text to a maximum length without breaking words.
 */
export const truncate = (text: string, maxLength = 150): string => {
  const clean = text.trim().replace(/\s+/g, " ");
  if (!clean) return "";

  const periodIndex = clean.search(SENTENCE_END);
  const firstSentence = periodIndex > 0 ? clean.slice(0, periodIndex + 1) : clean;
  if (firstSentence.length <= maxLength) return firstSentence;

  const truncated = firstSentence
    .slice(0, maxLength)
    .replace(WORD_BOUNDARY, "")
    .replace(/[.,;:]$/, "");

  return `${truncated}…`;
};

/** @deprecated Use `truncate` */
export const resumen = truncate;
