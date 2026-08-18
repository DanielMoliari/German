export function CountPill({ count }: { count: number }) {
  return (
    <div className="inline-block bg-[var(--gold)] text-[var(--bg)] font-extrabold text-sm px-4 py-1.5 rounded-full mb-5">
      {count} words learned
    </div>
  );
}
