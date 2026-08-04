export default function RecordForm({ fields, values, onChange }) {
  const set = (name, val) => onChange({ ...values, [name]: val });

  return (
    <div>
      {fields.map((f) => {
        const val = values[f.name] ?? '';
        return (
          <div className="mb-3.5" key={f.name}>
            <label className="block text-xs font-medium text-ink-soft mb-[5px]" htmlFor={f.name}>
              {f.label}{f.required ? ' *' : ''}
            </label>
            {f.type === 'textarea' ? (
              <textarea
                id={f.name}
                rows={3}
                value={val}
                onChange={(e) => set(f.name, e.target.value)}
                className="w-full px-2.5 py-2 border border-line rounded-radius text-[13.5px] font-body bg-bg text-ink focus:outline-none focus:border-teal focus:bg-white"
              />
            ) : f.type === 'select' ? (
              <select
                id={f.name}
                value={val}
                onChange={(e) => set(f.name, e.target.value)}
                className="w-full px-2.5 py-2 border border-line rounded-radius text-[13.5px] font-body bg-bg text-ink focus:outline-none focus:border-teal focus:bg-white"
              >
                <option value="">Select…</option>
                {f.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                id={f.name}
                type={f.type || 'text'}
                value={val}
                onChange={(e) => set(f.name, e.target.value)}
                className="w-full px-2.5 py-2 border border-line rounded-radius text-[13.5px] font-body bg-bg text-ink focus:outline-none focus:border-teal focus:bg-white"
              />
            )}
            {f.help ? <div className="text-[11.5px] text-ink-soft mt-1">{f.help}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
