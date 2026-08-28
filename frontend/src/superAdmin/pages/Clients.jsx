import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import RecordForm from '../components/RecordForm';
import { api } from '../api/client';
import { btn, panel, panelHeader, dataTable, th, td, trHover, cellTitle, cellMono, actionsCell, emptyState, loadingState, searchBar, searchInput, tabs, tabBtn, stamp } from '../lib/ui';

const EDIT_FIELDS = [
  { name: 'full_name', label: 'Full name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone_number', label: 'Phone number', required: true },
  { name: 'whatsapp_number', label: 'WhatsApp number' },
  { name: 'is_active', label: 'Status', type: 'select', options: ['true', 'false'] }
];

export default function Clients() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      let res;
      if (statusFilter !== 'all') {
        res = await api.get(`/clients/status/${statusFilter}`);
      } else {
        res = await api.get('/clients');
      }
      setRows(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [statusFilter]);

  const search = async (e) => {
    e.preventDefault();
    if (!q.trim()) return load();
    setLoading(true);
    try {
      const res = await api.get(`/clients/search?q=${encodeURIComponent(q)}`);
      setRows(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({ ...c, is_active: String(!!c.is_active) });
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/clients/${editing.id}`, { ...form, is_active: form.is_active === 'true' });
      setEditing(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this client and all related listings?')) return;
    try {
      await api.del(`/clients/${id}`);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Layout  title="Clients">
      <div className={panel}>
        <div className={panelHeader}>
          <h2>Client accounts</h2>
          <form className={searchBar} onSubmit={search}>
            <input className={searchInput} placeholder="Search name, email, phone…" value={q} onChange={(e) => setQ(e.target.value)} />
            <button className={btn('ghost', { sm: true })} type="submit">Search</button>
          </form>
        </div>
        <div className={tabs}>
          {['all', 'active', 'inactive'].map((s) => (
            <button key={s} className={tabBtn(statusFilter === s)} onClick={() => { setQ(''); setStatusFilter(s); }}>
              {s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={loadingState}>Loading clients…</div>
        ) : error ? (
          <div className="bg-danger-bg text-danger rounded-radius px-3 py-2.5 text-[12.5px]" style={{ margin: 20 }}>{error}</div>
        ) : (
          <table className={dataTable}>
            <thead>
              <tr><th className={th}>Full name</th><th className={th}>Email</th><th className={th}>Phone</th><th className={th}>Listings</th><th className={th}>Status</th><th className={th}></th></tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className={trHover}>
                  <td className={`${td} ${cellTitle}`}>{c.full_name}</td>
                  <td className={td}>{c.email}</td>
                  <td className={`${td} ${cellMono}`}>{c.phone_number}</td>
                  <td className={td}>{c.ads_count ?? 0}</td>
                  <td className={td}><span className={stamp(c.is_active ? 'active' : 'sold')}>{c.is_active ? 'active' : 'inactive'}</span></td>
                  <td className={td}>
                    <div className={actionsCell}>
                      <button className={btn('ghost', { sm: true })} onClick={() => openEdit(c)}>Edit</button>
                      <button className={btn('danger', { sm: true })} onClick={() => remove(c.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={6}><div className={emptyState}>No clients found.</div></td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <Modal
          title={`Edit — ${editing.full_name}`}
          onClose={() => setEditing(null)}
          footer={
            <>
              <button className={btn('ghost')} onClick={() => setEditing(null)}>Cancel</button>
              <button className={btn('primary')} disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save changes'}</button>
            </>
          }
        >
          <RecordForm fields={EDIT_FIELDS} values={form} onChange={setForm} />
        </Modal>
      )}
    </Layout>
  );
}
