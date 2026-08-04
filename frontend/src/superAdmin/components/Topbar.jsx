export default function Topbar({ title, eyebrow }) {
  return (
    <div className="flex items-center justify-between px-8 py-3 border-b border-black bg-black">
      <div>
        {eyebrow ? <div className="text-[10.5px] uppercase tracking-[0.14em] text-gold mb-0.5">{eyebrow}</div> : null}
        <h1 className="text-white text-lg">{title}</h1>
      </div>
    </div>
  );
}