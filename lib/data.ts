import wordsData from "@/data/words.json";
import etymologyData from "@/data/etymology-rules.json";
import type { Word, EtymologyRule } from "@/lib/types";

export function getWords(): Word[] {
  return wordsData as Word[];
}

export function getEtymologyRules(): EtymologyRule[] {
  return etymologyData as EtymologyRule[];
}
