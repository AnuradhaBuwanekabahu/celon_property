export default function Modal({ title, onClose, children, footer }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(27,43,41,0.45)] px-5 py-10"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-[560px] bg-surface rounded-radius shadow-modal">
        <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-line">
          <h2 style={{ fontSize: 16 }}>{title}</h2>
          <button className="bg-transparent border-none text-lg text-ink-soft leading-none" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <div className="px-[22px] py-5 max-h-[60vh] overflow-y-auto">{children}</div>
        {footer ? <div className="flex justify-end gap-2 px-[22px] py-4 border-t border-line">{footer}</div> : null}
      </div>
    </div>
  );
}
