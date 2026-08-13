export default function Modal({ title, onClose, children, footer }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 backdrop-blur-xs p-4 sm:p-6"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-[640px] bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <h2 className="text-lg font-bold tracking-tight text-white">{title}</h2>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-xl leading-none cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto bg-slate-50/50 space-y-4">
          {children}
        </div>

        {/* Modal Footer */}
        {footer ? (
          <div className="flex justify-end gap-3 px-6 py-4 bg-white border-t border-slate-200/80">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
