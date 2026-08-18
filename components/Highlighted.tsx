import { splitWithHighlights } from "@/lib/highlight";

export function Highlighted({
  word,
  indices,
  prefix,
}: {
  word: string;
  indices: number[] | undefined | null;
  prefix?: string;
}) {
  const segments = splitWithHighlights(word, indices);
  return (
    <>
      {prefix && <span className="text-[var(--text-faint)]">{prefix}</span>}
      {segments.map((seg, i) =>
        seg.highlighted ? (
          <span key={i} className="text-[var(--red)] font-extrabold">
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </>
  );
}
