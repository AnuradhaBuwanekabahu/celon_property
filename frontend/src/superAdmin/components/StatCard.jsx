export default function StatCard({ index, label, value, suffix }) {
  return (
    <div
      className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
      data-index={index}
    >
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 mb-3">
        {label}
      </div>
      <div className="font-bold text-[30px] text-slate-900 leading-none tabular-nums">
        {value}
        {suffix ? (
          <small className="text-sm font-medium text-slate-400 ml-1.5">{suffix}</small>
        ) : null}
      </div>
    </div>
  );
}
