const GERMAN_ARTICLES = ["der ", "die ", "das "];

export function bareGermanWord(german: string): string {
  for (const article of GERMAN_ARTICLES) {
    if (german.startsWith(article)) {
      return german.slice(article.length);
    }
  }
  return german;
}

export function articlePrefix(german: string): string {
  for (const article of GERMAN_ARTICLES) {
    if (german.startsWith(article)) {
      return article;
    }
  }
  return "";
}

export type HighlightSegment = { text: string; highlighted: boolean };

export function splitWithHighlights(
  word: string,
  indices: number[] | undefined | null
): HighlightSegment[] {
  if (!indices || indices.length === 0) {
    return [{ text: word, highlighted: false }];
  }
  const indexSet = new Set(indices);
  const segments: HighlightSegment[] = [];
  let current = "";
  let currentHighlighted = false;

  for (let i = 0; i < word.length; i++) {
    const isHighlighted = indexSet.has(i);
    if (i === 0) {
      currentHighlighted = isHighlighted;
      current = word[i];
      continue;
    }
    if (isHighlighted === currentHighlighted) {
      current += word[i];
    } else {
      segments.push({ text: current, highlighted: currentHighlighted });
      current = word[i];
      currentHighlighted = isHighlighted;
    }
  }
  if (current) {
    segments.push({ text: current, highlighted: currentHighlighted });
  }
  return segments;
}
