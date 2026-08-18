import { TopNav } from "@/components/TopNav";
import { RuleCard } from "@/components/RuleCard";
import { getEtymologyRules } from "@/lib/data";

export default function EtymologyPage() {
  const rules = getEtymologyRules();

  return (
    <div>
      <TopNav active="etymology" />
      <main className="max-w-[820px] mx-auto px-6 pt-10 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1.5">Etymology Rules</h1>
          <p className="text-sm text-[var(--text-dim)]">
            Sound-shift patterns and cognate pairs between German and English.
          </p>
        </div>
        <div className="flex flex-col gap-3.5">
          {rules.map((rule) => (
            <RuleCard key={rule.id} rule={rule} />
          ))}
        </div>
      </main>
    </div>
  );
}
