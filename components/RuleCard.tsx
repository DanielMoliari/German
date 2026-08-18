import type { EtymologyRule } from "@/lib/types";
import { Highlighted } from "@/components/Highlighted";

export function RuleCard({ rule }: { rule: EtymologyRule }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-5.5 py-5">
      <div>
        <span className="font-bold text-base">{rule.title}</span>
        <span className="text-[10px] uppercase text-[var(--gold)] bg-[var(--surface-3)] px-2 py-0.5 rounded ml-2.5">
          {rule.type}
        </span>
      </div>
      <div className="text-[13px] text-[var(--text-dim)] mt-2 mb-3.5">{rule.description}</div>
      <div className="flex flex-wrap gap-2">
        {rule.examples.map((ex, i) => (
          <div
            key={i}
            className="bg-[var(--surface-3)] px-3 py-1.5 rounded text-sm border-l-2 border-[var(--gold)]"
          >
            <Highlighted word={ex.german} indices={ex.highlight?.german} />
            {" / "}
            <Highlighted word={ex.english} indices={ex.highlight?.english} />
          </div>
        ))}
      </div>
    </div>
  );
}
