import { CountPill } from "@/components/CountPill";
import { WordListClient } from "@/components/WordListClient";
import { getWords, getEtymologyRules } from "@/lib/data";

export default function Home() {
  const words = getWords();
  const etymologyRules = getEtymologyRules();

  return (
    <div>
      <div
        aria-hidden
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(90deg, #000 0 33.33%, #dd0000 33.33% 66.66%, #ffce00 66.66% 100%)",
        }}
      />
      <header className="text-center pt-8 px-6">
        <div className="text-lg font-extrabold mb-5">Deutsch Lernen</div>
        <CountPill count={words.length} />
      </header>
      <main className="max-w-[820px] mx-auto px-6 pt-3 pb-20">
        <WordListClient words={words} etymologyRules={etymologyRules} />
      </main>
    </div>
  );
}
