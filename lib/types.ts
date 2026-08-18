export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "preposition"
  | "pronoun"
  | "conjunction"
  | "interjection"
  | "other";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Highlight = {
  german: number[];
  english: number[];
};

export type Word = {
  id: string;
  german: string;
  english: string;
  partOfSpeech: PartOfSpeech;
  gender: "der" | "die" | "das" | null;
  plural: string | null;
  category: string;
  difficulty: Difficulty;
  exampleSentence: string | null;
  exampleTranslation: string | null;
  dateLearned: string;
  needsReview: boolean;
  highlight: Highlight | null;
};

export type EtymologyExample = {
  german: string;
  english: string;
  highlight: Highlight | null;
};

export type EtymologyRuleType = "sound-shift" | "cognate-pair";

export type EtymologyRule = {
  id: string;
  title: string;
  description: string;
  type: EtymologyRuleType;
  examples: EtymologyExample[];
};
