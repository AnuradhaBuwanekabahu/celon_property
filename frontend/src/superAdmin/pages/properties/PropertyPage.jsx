import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import RecordForm from '../../components/RecordForm';
import PropertyForm from '../../components/PropertyForm';
import { api } from '../../api/client';

const STATUS_COLORS = {
  pending:  'bg-amber-50 text-amber-700 border-amber-200',
  active:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  sold:     'bg-slate-100 text-slate-500 border-slate-200',
  rented:   'bg-slate-100 text-slate-500 border-slate-200',
  closed:   'bg-slate-100 text-slate-500 border-slate-200',
};

function StatusPill({ status }) {
  const s = String(status || '').toLowerCase();
  const cls = STATUS_COLORS[s] || 'bg-slate-100 text-slate-500 border-slate-200';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
}

export default function PropertyPage({ config }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [q, setQ] = useState('');
  const [modalMode, setModalMode] = useState(null); // null | 'create' | rowObject
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const [limits, setLimits] = useState([]);

  const normalizeRows = (response) => {
    if (Array.isArray(response)) return response;
    if (!response || typeof response !== 'object') return [];

    const candidates = [
      response.data,
      response.rows,
      response.lands,
      response.hotSales,
      response.items,
      response.result,
      response.list,
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) return candidate;
    }

    return [];
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      let res;
      if (statusFilter !== 'all') {
        res = await api.get(`${config.basePath}/status/${statusFilter}`);
      } else {
        res = await api.get(config.basePath);
      }

      const payload = normalizeRows(res);
      setRows(Array.isArray(payload) ? payload : []);

      // Fetch limits
      try {
        const limRes = await api.get('/limits');
        setLimits(Array.isArray(limRes.data) ? limRes.data : []);
      } catch (e) {
        console.warn('Failed to fetch limits', e);
      }
    } catch (err) {
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [config.basePath, statusFilter]);

  const search = async (e) => {
    e.preventDefault();
    if (!q.trim()) return load();
    setLoading(true);
    try {
      const res = await api.get(`${config.basePath}/search?search=${encodeURIComponent(q)}`);
      const payload = normalizeRows(res);
      setRows(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => { setForm({}); setModalMode('create'); };
  const openEdit   = (row) => { setForm(row); setModalMode(row); };

  // Generate dynamic fields for RecordForm
  const getDynamicFields = () => {
    if (!config.fields) return [];
    return config.fields.map(f => {
      if (f.name === 'days') {
        return {
          ...f,
          type: 'select',
          label: 'Limit Tier (Active days)',
          options: limits.map(l => ({
            label: `Tier ${l.tier_order} - ${l.days} Days`,
            value: l.days
          }))
        };
      }
      return f;
    });
  };

  // ── Save for simple RecordForm (JSON body)
  const saveSimple = async () => {
    setSaving(true);
    try {
      if (modalMode === 'create') {
        await api.post(config.basePath, form);
      } else {
        await api.put(`${config.basePath}/${modalMode.id}`, form);
      }
      setModalMode(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Save for rich PropertyForm (FormData / multipart)
  const saveRich = async (formData) => {
    setSaving(true);
    try {
      if (modalMode === 'create') {
        await api.post(config.basePath, formData);
      } else {
        await api.put(`${config.basePath}/${modalMode.id}`, formData);
      }
      setModalMode(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id, status) => {
    setBusyId(id);
    try {
      await api.patch(`${config.basePath}/${id}/status`, { status });
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await api.del(`${config.basePath}/${id}`);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const isRich = !!config.richForm;
  const editRow = modalMode !== 'create' ? modalMode : null;

  return (
    <Layout eyebrow={config.eyebrow} title={config.title}>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-200 bg-slate-50/60">
          <div>
            <h2 className="text-base font-bold text-slate-900 m-0">{config.title} listings</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {loading ? 'Loading…' : `${rows.length} record${rows.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <form className="flex gap-2" onSubmit={search}>
              <input
                className="flex-1 sm:min-w-[200px] px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                placeholder="Search listings…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button type="submit" className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition">
                Search
              </button>
            </form>
            <button
              className="px-4 py-2 text-sm font-semibold text-white bg-[#14213D] rounded-xl hover:bg-[#1c2c52] transition"
              onClick={openCreate}
            >
              + New listing
            </button>
          </div>
        </div>

        {/* ── Status Tabs ── */}
        <div className="flex overflow-x-auto gap-1 px-4 border-b border-slate-200 bg-white">
          {['all', ...config.statuses].map((s) => {
            const isActive = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => { setQ(''); setStatusFilter(s); }}
                className={`flex-shrink-0 px-4 py-3 text-[13px] font-medium border-b-2 -mb-px transition-colors
                  ${isActive ? 'border-amber-500 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            );
          })}
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="px-6 py-16 text-center text-slate-400 text-sm">Loading listings…</div>
        ) : error ? (
          <div className="m-5 px-4 py-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-[13px]">
              <thead>
                <tr className="bg-slate-50/80">
                  {config.columns.map((c) => (
                    <th key={c.key} className="text-left text-[11px] font-semibold uppercase tracking-widest text-slate-500 px-5 py-3 border-b border-slate-200 whitespace-nowrap">
                      {c.label}
                    </th>
                  ))}
                  <th className="text-left text-[11px] font-semibold uppercase tracking-widest text-slate-500 px-5 py-3 border-b border-slate-200 whitespace-nowrap">Status</th>
                  <th className="px-5 py-3 border-b border-slate-200" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-amber-50/40 border-b border-slate-100 last:border-b-0 transition-colors">
                    {config.columns.map((c) => (
                      <td key={c.key} className="px-5 py-3.5 align-middle whitespace-nowrap">
                        {c.cell ? c.cell(r) : r[c.key]}
                      </td>
                    ))}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="px-5 py-3.5 align-middle">
                      <div className="flex items-center gap-2 justify-end">
                        <select
                          value=""
                          onChange={(e) => e.target.value && updateStatus(r.id, e.target.value)}
                          disabled={busyId === r.id}
                          className="text-xs px-2 py-1.5 border border-slate-300 bg-white rounded-lg text-slate-700 cursor-pointer hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition disabled:opacity-50"
                        >
                          <option value="">Set status…</option>
                          {config.statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button onClick={() => openEdit(r)} className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition">
                          Edit
                        </button>
                        <button onClick={() => remove(r.id)} className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={config.columns.length + 2}>
                      <div className="px-6 py-16 text-center text-slate-400 text-sm">No listings in this view.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {modalMode && (
        isRich ? (
          /* Rich form — no outer footer buttons, they're inside PropertyForm */
          <Modal
            title={modalMode === 'create' ? `New ${config.title} listing` : `Edit — ${editRow?.title || 'Listing'}`}
            onClose={() => setModalMode(null)}
          >
            <PropertyForm
              key={modalMode === 'create' ? 'create' : editRow?.id}
              initialValues={editRow || {}}
              statuses={config.statuses}
              showRentPeriod={config.slug === 'stays-to-rent'}
              isHotSales={config.slug === 'hot-sales'}
              saving={saving}
              onSave={saveRich}
              onClose={() => setModalMode(null)}
              limits={limits}
            />
          </Modal>
        ) : (
          /* Simple form */
          <Modal
            title={modalMode === 'create' ? `New ${config.title} listing` : `Edit — ${editRow?.title}`}
            onClose={() => setModalMode(null)}
            footer={
              <>
                <button className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition" onClick={() => setModalMode(null)}>Cancel</button>
                <button className="px-5 py-2 text-sm font-semibold text-white bg-[#14213D] rounded-xl hover:bg-[#1c2c52] disabled:opacity-50 transition" disabled={saving} onClick={saveSimple}>
                  {saving ? 'Saving…' : 'Save listing'}
                </button>
              </>
            }
          >
            <RecordForm fields={getDynamicFields()} values={form} onChange={setForm} />
          </Modal>
        )
      )}
    </Layout>
  );
}
