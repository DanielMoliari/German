import Link from "next/link";

export function TopNav({ active }: { active: "words" | "etymology" }) {
  return (
    <header className="text-center pt-8 px-6">
      <div className="text-lg font-extrabold mb-5">Deutsch Lernen</div>
      <nav className="flex justify-center gap-1 border-b border-[var(--border-soft)] mx-6">
        <Link
          href="/"
          className={`px-6 py-3 text-sm font-bold -mb-px border-b-2 ${
            active === "words"
              ? "text-[var(--gold)] border-[var(--gold)]"
              : "text-[var(--text-dim)] border-transparent"
          }`}
        >
          Word List
        </Link>
        <Link
          href="/etymology"
          className={`px-6 py-3 text-sm font-bold -mb-px border-b-2 ${
            active === "etymology"
              ? "text-[var(--gold)] border-[var(--gold)]"
              : "text-[var(--text-dim)] border-transparent"
          }`}
        >
          Etymology
        </Link>
      </nav>
    </header>
  );
}
