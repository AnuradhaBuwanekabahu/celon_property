import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import RecordForm from '../components/RecordForm';
import { api } from '../api/client';

const TABS = [
  { key: 'all',      label: 'All admins',  path: '/admin' },
  { key: 'pending',  label: 'Pending',     path: '/admin/pending' },
  { key: 'approved', label: 'Approved',    path: '/admin/approved' },
];

const CREATE_FIELDS = [
  { name: 'Name',     label: 'Admin name', required: true },
  { name: 'email',    label: 'Email',      type: 'email',    required: true },
  { name: 'password', label: 'Password',   type: 'password', required: true },
];

function RoleBadge({ role }) {
  const isSuper = role === 'super_admin';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border
      ${isSuper
        ? 'bg-violet-50 text-violet-700 border-violet-200'
        : 'bg-slate-100 text-slate-600 border-slate-200'
      }`}>
      {role || 'admin'}
    </span>
  );
}

function StatusPill({ approved }) {
  return approved ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Approved
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-amber-50 text-amber-700 border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      Pending
    </span>
  );
}

export default function Admins() {
  const [tab, setTab] = useState('all');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [actioningId, setActioningId] = useState(null);

  const isApproved = (a) => a.is_approved === 1 || a.is_approved === true || a.is_approved === '1';

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const path = TABS.find((t) => t.key === tab).path;
      const res = await api.get(path);
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [tab]);

  const createAdmin = async () => {
    setSaving(true);
    try {
      await api.post('/admin', { ...form, is_approved: true });
      setShowCreate(false);
      setForm({});
      setTab('all');
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const approve = async (id) => {
    setActioningId(id);
    try {
      await api.patch(`/admin/${id}/approve`);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setActioningId(null);
    }
  };

  const reject = async (id) => {
    if (!confirm('Reject and remove this admin request?')) return;
    setActioningId(id);
    try {
      await api.del(`/admin/${id}/reject`);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setActioningId(null);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this admin permanently?')) return;
    setActioningId(id);
    try {
      await api.del(`/admin/${id}`);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setActioningId(null);
    }
  };

  const pendingCount = rows.filter((a) => !isApproved(a)).length;

  return (
    <Layout title="Admins">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-200 bg-slate-50/60">
          <div>
            <h2 className="text-base font-bold text-slate-900 m-0">Admin accounts</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {loading ? 'Loading…' : `${rows.length} admin${rows.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            className="px-4 py-2 text-sm font-semibold text-white bg-[#14213D] rounded-xl hover:bg-[#1c2c52] transition"
            onClick={() => { setForm({}); setShowCreate(true); }}
          >
            + New admin
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex overflow-x-auto gap-1 px-4 border-b border-slate-200 bg-white">
          {TABS.map((t) => {
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 text-[13px] font-medium border-b-2 -mb-px transition-colors
                  ${isActive
                    ? 'border-amber-500 text-amber-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
              >
                {t.label}
                {t.key === 'pending' && pendingCount > 0 && !loading && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full leading-none">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="px-6 py-16 text-center text-slate-400 text-sm">Loading admins…</div>
        ) : error ? (
          <div className="m-5 px-4 py-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-[13px]">
              <thead>
                <tr className="bg-slate-50/80">
                  {['Name', 'Email', 'Role', 'Status', 'Joined', ''].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[11px] font-semibold uppercase tracking-widest text-slate-500 px-5 py-3 border-b border-slate-200 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => {
                  const approved = isApproved(a);
                  const busy = actioningId === a.id;
                  return (
                    <tr
                      key={a.id}
                      className="hover:bg-amber-50/40 border-b border-slate-100 last:border-b-0 transition-colors"
                    >
                      <td className="px-5 py-3.5 align-middle">
                        <span className="font-semibold text-slate-900">{a.Name || a.name}</span>
                      </td>
                      <td className="px-5 py-3.5 align-middle text-slate-600 whitespace-nowrap">{a.email}</td>
                      <td className="px-5 py-3.5 align-middle">
                        <RoleBadge role={a.role} />
                      </td>
                      <td className="px-5 py-3.5 align-middle">
                        <StatusPill approved={approved} />
                      </td>
                      <td className="px-5 py-3.5 align-middle text-slate-500 text-xs font-mono whitespace-nowrap">
                        {a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-5 py-3.5 align-middle">
                        <div className="flex items-center gap-2 justify-end">
                          {!approved ? (
                            <>
                              <button
                                disabled={busy}
                                onClick={() => approve(a.id)}
                                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg border border-emerald-500 hover:bg-emerald-500 disabled:opacity-50 transition"
                              >
                                ✓ Approve
                              </button>
                              <button
                                disabled={busy}
                                onClick={() => reject(a.id)}
                                className="px-3.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 disabled:opacity-50 transition"
                              >
                                ✕ Reject
                              </button>
                            </>
                          ) : (
                            a.role !== 'super_admin' && (
                              <button
                                disabled={busy}
                                onClick={() => remove(a.id)}
                                className="px-3.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 disabled:opacity-50 transition"
                              >
                                Delete
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="px-6 py-16 text-center text-slate-400 text-sm">
                        No admins found in this view.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create Admin Modal ── */}
      {showCreate && (
        <Modal
          title="New admin account"
          onClose={() => setShowCreate(false)}
          footer={
            <>
              <button
                className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 text-sm font-semibold text-white bg-[#14213D] rounded-xl hover:bg-[#1c2c52] disabled:opacity-50 transition"
                disabled={saving}
                onClick={createAdmin}
              >
                {saving ? 'Creating…' : 'Create admin'}
              </button>
            </>
          }
        >
          <RecordForm fields={CREATE_FIELDS} values={form} onChange={setForm} />
        </Modal>
      )}
    </Layout>
  );
}
