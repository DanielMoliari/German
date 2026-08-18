"use client";

import { useMemo, useState } from "react";
import type { Word, EtymologyRule, PartOfSpeech, Difficulty } from "@/lib/types";
import { Highlighted } from "@/components/Highlighted";
import { bareGermanWord, articlePrefix } from "@/lib/highlight";
import { RuleCard } from "@/components/RuleCard";

type Tab = "study" | "table" | "etymology";

const PART_OF_SPEECH_OPTIONS: PartOfSpeech[] = [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "preposition",
  "pronoun",
  "conjunction",
  "interjection",
  "other",
];

const DIFFICULTY_OPTIONS: Difficulty[] = ["beginner", "intermediate", "advanced"];

export function WordListClient({
  words,
  etymologyRules,
}: {
  words: Word[];
  etymologyRules: EtymologyRule[];
}) {
  const [tab, setTab] = useState<Tab>("study");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [reviewOnly, setReviewOnly] = useState(false);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(words.map((w) => w.category))).sort(),
    [words]
  );

  const filtered = useMemo(() => {
    return words.filter(
      (w) =>
        (!type || w.partOfSpeech === type) &&
        (!category || w.category === category) &&
        (!difficulty || w.difficulty === difficulty) &&
        (!reviewOnly || w.needsReview)
    );
  }, [words, type, category, difficulty, reviewOnly]);

  const stats = useMemo(() => {
    const nouns = words.filter((w) => w.partOfSpeech === "noun").length;
    const verbs = words.filter((w) => w.partOfSpeech === "verb").length;
    const adjectives = words.filter((w) => w.partOfSpeech === "adjective").length;
    const beginner = words.filter((w) => w.difficulty === "beginner").length;
    const intermediate = words.filter((w) => w.difficulty === "intermediate").length;
    const needsReview = words.filter((w) => w.needsReview).length;
    return { nouns, verbs, adjectives, beginner, intermediate, needsReview };
  }, [words]);

  function clearFilters() {
    setType("");
    setCategory("");
    setDifficulty("");
    setReviewOnly(false);
    setCurrent(0);
    setFlipped(false);
  }

  function goPrev() {
    setFlipped(false);
    setCurrent((c) => Math.max(0, c - 1));
  }

  function goNext() {
    setFlipped(false);
    setCurrent((c) => Math.min(filtered.length - 1, c + 1));
  }

  function selectTab(next: Tab) {
    setTab(next);
    setCurrent(0);
    setFlipped(false);
  }

  const activeWord = filtered[Math.min(current, filtered.length - 1)];

  return (
    <div>
      <div className="flex justify-center gap-1 mb-6">
        <button
          onClick={() => selectTab("study")}
          className={`px-6 py-2 text-sm font-bold rounded-t-md border-b-2 ${
            tab === "study"
              ? "text-[var(--gold)] border-[var(--gold)]"
              : "text-[var(--text-dim)] border-transparent"
          }`}
        >
          Study
        </button>
        <button
          onClick={() => selectTab("table")}
          className={`px-6 py-2 text-sm font-bold rounded-t-md border-b-2 ${
            tab === "table"
              ? "text-[var(--gold)] border-[var(--gold)]"
              : "text-[var(--text-dim)] border-transparent"
          }`}
        >
          Table
        </button>
        <button
          onClick={() => selectTab("etymology")}
          className={`px-6 py-2 text-sm font-bold rounded-t-md border-b-2 ${
            tab === "etymology"
              ? "text-[var(--gold)] border-[var(--gold)]"
              : "text-[var(--text-dim)] border-transparent"
          }`}
        >
          Etymology
        </button>
      </div>

      {/* Shared filter bar (Study + Table only) */}
      {tab !== "etymology" && (
      <div className="flex flex-wrap items-center gap-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3.5 mb-6">
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setCurrent(0);
            setFlipped(false);
          }}
          className="bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm rounded-lg px-3 py-1.5"
        >
          <option value="">All types</option>
          {PART_OF_SPEECH_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setCurrent(0);
            setFlipped(false);
          }}
          className="bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm rounded-lg px-3 py-1.5"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
            setCurrent(0);
            setFlipped(false);
          }}
          className="bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm rounded-lg px-3 py-1.5"
        >
          <option value="">All difficulty</option>
          {DIFFICULTY_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <label
          className={`flex items-center gap-1.5 cursor-pointer select-none px-3 py-1.5 rounded-lg border text-sm ${
            reviewOnly
              ? "border-[var(--red)] text-[var(--red)] bg-[rgba(227,72,72,0.08)]"
              : "border-[var(--border)] text-[var(--text-dim)] bg-[var(--surface-2)]"
          }`}
        >
          <input
            type="checkbox"
            checked={reviewOnly}
            onChange={(e) => {
              setReviewOnly(e.target.checked);
              setCurrent(0);
              setFlipped(false);
            }}
            className="accent-[var(--red)]"
          />
          Needs review only
        </label>
        <button
          onClick={clearFilters}
          className="bg-transparent border border-[var(--border)] text-[var(--text-faint)] text-xs px-3 py-1.5 rounded-lg hover:text-[var(--text)] hover:border-[var(--text-faint)]"
        >
          Clear
        </button>
        <span className="ml-auto text-xs text-[var(--text-faint)]">
          {filtered.length} word{filtered.length === 1 ? "" : "s"}
        </span>
      </div>
      )}

      {tab === "study" && (
        <div>
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[420px]">
              {filtered.length === 0 ? (
                <div className="text-center text-[var(--text-faint)] text-sm py-16">
                  No words match these filters.
                </div>
              ) : (
                <StudyCard word={activeWord} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
              )}
            </div>
            <div className="flex gap-2.5 items-center mt-5">
              <button
                onClick={goPrev}
                disabled={current === 0}
                className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] px-4.5 py-2 rounded-lg text-sm font-semibold disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="text-sm text-[var(--text-faint)]">
                {filtered.length === 0 ? "0 / 0" : `${current + 1} / ${filtered.length}`}
              </span>
              <button
                onClick={goNext}
                disabled={filtered.length === 0 || current === filtered.length - 1}
                className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] px-4.5 py-2 rounded-lg text-sm font-semibold disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap justify-center mt-9">
            <StatCard n={stats.nouns} label="Nouns" />
            <StatCard n={stats.verbs} label="Verbs" />
            <StatCard n={stats.adjectives} label="Adjectives" />
            <StatCard n={stats.beginner} label="Beginner" />
            <StatCard n={stats.intermediate} label="Intermediate" />
            <StatCard n={stats.needsReview} label="Needs review" red />
          </div>
        </div>
      )}

      {tab === "table" && <WordTable words={filtered} />}

      {tab === "etymology" && (
        <div className="flex flex-col gap-3.5">
          {etymologyRules.map((rule) => (
            <RuleCard key={rule.id} rule={rule} />
          ))}
        </div>
      )}
    </div>
  );
}

function StudyCard({
  word,
  flipped,
  onFlip,
}: {
  word: Word;
  flipped: boolean;
  onFlip: () => void;
}) {
  const bare = bareGermanWord(word.german);
  const prefix = articlePrefix(word.german);

  return (
    <div className="[perspective:1200px] w-full h-[270px] cursor-pointer relative" onClick={onFlip}>
      {word.needsReview && (
        <div className="absolute -top-2.5 right-1.5 z-10 bg-[var(--red)] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide">
          Review
        </div>
      )}
      <div
        className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
      >
        <div className="absolute inset-0 [backface-visibility:hidden] bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex flex-col items-center justify-center p-7 text-center">
          <div className="text-3xl font-extrabold">
            <Highlighted word={bare} indices={word.highlight?.german} />
          </div>
        </div>
        <div
          className="absolute inset-0 [backface-visibility:hidden] bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl flex flex-col items-center justify-center p-7 text-center"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="text-2xl text-[var(--text-dim)]">
            <Highlighted word={word.english} indices={word.highlight?.english} />
          </div>
          {(word.gender || word.plural) && (
            <div className="text-[13px] text-[var(--text-faint)] mt-3.5">
              {prefix.trim()}
              {word.plural ? ` · pl. ${word.plural}` : ""}
            </div>
          )}
          <div className="inline-block bg-[var(--surface-3)] text-[var(--gold)] px-3 py-1 rounded-full text-[11px] mt-3.5 border border-[#2a2a2f]">
            {word.category} · {word.difficulty}
          </div>
          {word.exampleSentence && (
            <div className="text-[13px] text-[var(--text-dim)] mt-3 italic">
              &ldquo;{word.exampleSentence}&rdquo; — {word.exampleTranslation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ n, label, red }: { n: number; label: string; red?: boolean }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4.5 py-3 text-center min-w-[100px]">
      <div className={`text-lg font-extrabold ${red ? "text-[var(--red)]" : "text-[var(--gold)]"}`}>{n}</div>
      <div className="text-[11px] text-[var(--text-faint)] mt-0.5">{label}</div>
    </div>
  );
}

function WordTable({ words }: { words: Word[] }) {
  if (words.length === 0) {
    return (
      <div className="text-center text-[var(--text-faint)] text-sm py-16">
        No words match these filters.
      </div>
    );
  }

  return (
    <table className="w-full border-collapse mt-2">
      <thead>
        <tr>
          <th className="text-left text-[11px] uppercase tracking-wide text-[var(--text-faint)] px-3.5 py-2.5 border-b border-[var(--border)]"></th>
          <th className="text-left text-[11px] uppercase tracking-wide text-[var(--text-faint)] px-3.5 py-2.5 border-b border-[var(--border)]">
            German
          </th>
          <th className="text-left text-[11px] uppercase tracking-wide text-[var(--text-faint)] px-3.5 py-2.5 border-b border-[var(--border)]">
            English
          </th>
          <th className="text-left text-[11px] uppercase tracking-wide text-[var(--text-faint)] px-3.5 py-2.5 border-b border-[var(--border)]">
            Type
          </th>
          <th className="text-left text-[11px] uppercase tracking-wide text-[var(--text-faint)] px-3.5 py-2.5 border-b border-[var(--border)]">
            Category
          </th>
          <th className="text-left text-[11px] uppercase tracking-wide text-[var(--text-faint)] px-3.5 py-2.5 border-b border-[var(--border)]">
            Difficulty
          </th>
        </tr>
      </thead>
      <tbody>
        {words.map((w) => {
          const bare = bareGermanWord(w.german);
          return (
            <tr key={w.id} className="hover:bg-[var(--surface)]">
              <td className="px-3.5 py-3 border-b border-[var(--border-soft)] text-sm">
                {w.needsReview && (
                  <span
                    title="Needs review"
                    className="inline-block w-[7px] h-[7px] rounded-full bg-[var(--red)]"
                  />
                )}
              </td>
              <td className="px-3.5 py-3 border-b border-[var(--border-soft)] text-sm">
                <Highlighted word={bare} indices={w.highlight?.german} />
              </td>
              <td className="px-3.5 py-3 border-b border-[var(--border-soft)] text-sm">
                <Highlighted word={w.english} indices={w.highlight?.english} />
              </td>
              <td className="px-3.5 py-3 border-b border-[var(--border-soft)] text-sm">{w.partOfSpeech}</td>
              <td className="px-3.5 py-3 border-b border-[var(--border-soft)] text-sm">{w.category}</td>
              <td className="px-3.5 py-3 border-b border-[var(--border-soft)] text-sm">{w.difficulty}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
