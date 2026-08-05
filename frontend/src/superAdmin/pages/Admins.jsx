import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import RecordForm from '../components/RecordForm';
import { api } from '../api/client';
import { btn, panel, panelHeader, dataTable, th, td, trHover, cellTitle, cellSub, cellMono, actionsCell, emptyState, loadingState, tabs, tabBtn, stamp } from '../lib/ui';

const TABS = [
  { key: 'all', label: 'All admins', path: '/admin' },
  { key: 'pending', label: 'Pending', path: '/admin/pending' },
  { key: 'approved', label: 'Approved', path: '/admin/approved' }
];

const CREATE_FIELDS = [
  { name: 'Name', label: 'Admin name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'password', label: 'Password', type: 'password', required: true }
];

export default function Admins() {
  const [tab, setTab] = useState('all');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [actioningId, setActioningId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const path = TABS.find((t) => t.key === tab).path;
      const res = await api.get(path);
      setRows(res.data);
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

  return (
    <Layout title="Admins">
      <div className={panel}>
        <div className={panelHeader}>
          <h2>Admin accounts</h2>
          <button className={btn('accent')} onClick={() => setShowCreate(true)}>+ New admin</button>
        </div>
        <div className={tabs}>
          {TABS.map((t) => (
            <button
              key={t.key}
              className={tabBtn(tab === t.key)}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={loadingState}>Loading admins…</div>
        ) : error ? (
          <div className="bg-danger-bg text-danger rounded-radius px-3 py-2.5 text-[12.5px]" style={{ margin: 20 }}>{error}</div>
        ) : (
          <table className={dataTable}>
            <thead>
              <tr><th className={th}>Name</th><th className={th}>Email</th><th className={th}>Role</th><th className={th}>Status</th><th className={th}>Joined</th><th className={th}></th></tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className={trHover}>
                  <td className={`${td} ${cellTitle}`}>{a.Name || a.name}</td>
                  <td className={td}>{a.email}</td>
                  <td className={td}>{a.role || 'admin'}</td>
                  <td className={td}>
                    <span className={stamp(a.is_approved ? 'approved' : 'pending')}>
                      {a.is_approved ? 'approved' : 'pending'}
                    </span>
                  </td>
                  <td className={`${td} ${cellSub} ${cellMono}`}>{a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'}</td>
                  <td className={td}>
                    <div className={actionsCell}>
                      {!a.is_approved && (
                        <button className={btn('primary', { sm: true })} disabled={actioningId === a.id} onClick={() => approve(a.id)}>Approve</button>
                      )}
                      {!a.is_approved ? (
                        <button className={btn('danger', { sm: true })} disabled={actioningId === a.id} onClick={() => reject(a.id)}>Reject</button>
                      ) : (
                        <button className={btn('danger', { sm: true })} disabled={actioningId === a.id} onClick={() => remove(a.id)}>Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={6}><div className={emptyState}>No admins in this view.</div></td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showCreate && (
        <Modal
          title="New admin"
          onClose={() => setShowCreate(false)}
          footer={
            <>
              <button className={btn('ghost')} onClick={() => setShowCreate(false)}>Cancel</button>
              <button className={btn('primary')} disabled={saving} onClick={createAdmin}>
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
