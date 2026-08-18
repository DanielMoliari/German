import { TopNav } from "@/components/TopNav";
import { CountPill } from "@/components/CountPill";
import { WordListClient } from "@/components/WordListClient";
import { getWords } from "@/lib/data";

export default function Home() {
  const words = getWords();

  return (
    <div>
      <TopNav active="words" />
      <div className="text-center">
        <CountPill count={words.length} />
      </div>
      <main className="max-w-[820px] mx-auto px-6 pt-7 pb-20">
        <WordListClient words={words} />
      </main>
    </div>
  );
}
