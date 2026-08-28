export default function RecordForm({ fields, values, onChange }) {
  const set = (name, val) => onChange({ ...values, [name]: val });

  const handleFileChange = (name, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      set(name, e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {fields.map((f) => {
        const val = values[f.name] ?? '';
        const isImage = f.type === 'image' || f.name === 'main_image';

        return (
          <div
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all duration-150 hover:border-slate-300"
            key={f.name}
          >
            <label
              className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-800 tracking-wide"
              htmlFor={f.name}
            >
              <span className="flex items-center gap-1">
                {f.label}
                {f.required && <span className="text-rose-500 font-bold text-sm">*</span>}
              </span>
              {f.name === 'client_id' && (
                <span className="text-[11px] font-normal text-slate-400">Optional</span>
              )}
            </label>

            {f.type === 'textarea' ? (
              <textarea
                id={f.name}
                rows={3}
                value={val}
                onChange={(e) => set(f.name, e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 font-sans"
                placeholder={`Enter ${f.label.toLowerCase()}...`}
              />
            ) : f.type === 'select' ? (
              <select
                id={f.name}
                value={val}
                onChange={(e) => set(f.name, e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-900 font-medium transition-all duration-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 cursor-pointer"
              >
                <option value="">Select option...</option>
                {f.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : isImage ? (
              <div className="space-y-3">
                <input
                  id={f.name}
                  type="text"
                  value={val}
                  onChange={(e) => set(f.name, e.target.value)}
                  placeholder="Paste image URL or choose file below..."
                  className="w-full rounded-lg border border-slate-300 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 font-sans"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-slate-800 active:scale-[0.98]">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Upload Image File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(f.name, e.target.files?.[0])}
                    />
                  </label>
                  {val && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      Image Attached
                    </span>
                  )}
                </div>
                {val && (
                  <div className="relative mt-2 h-28 w-28 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-xs">
                    <img
                      src={val}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <input
                id={f.name}
                type={f.type || 'text'}
                value={val}
                onChange={(e) => set(f.name, e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 font-sans"
                placeholder={`Enter ${f.label.toLowerCase()}...`}
              />
            )}

            {f.help && (
              <div className="mt-1.5 text-[11.5px] font-medium text-slate-500">{f.help}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
