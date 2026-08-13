export default function Topbar({ title, eyebrow }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0f172a] to-[#14213D] border-b border-white/10">
      <div>
        {eyebrow ? (
          <div className="text-[10px] uppercase tracking-[0.18em] text-amber-400 mb-1 font-semibold">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-white text-[19px] font-bold tracking-tight m-0">{title}</h1>
      </div>
    </div>
  );
}