export default function StatCard({ index, label, value, suffix }) {
  return (
    <div
      className="relative overflow-hidden bg-surface border border-line rounded-radius p-4 px-[18px] shadow-card before:content-[attr(data-index)] before:absolute before:top-2.5 before:right-3 before:font-mono before:text-[10px] before:text-line"
      data-index={index}
    >
      <div className="text-[11.5px] uppercase tracking-[0.08em] text-ink-soft mb-2">{label}</div>
      <div className="font-display text-[32px] font-semibold text-teal-deep leading-none">
        {value}
        {suffix ? <small className="text-sm font-medium text-ink-soft ml-1">{suffix}</small> : null}
      </div>
    </div>
  );
}
