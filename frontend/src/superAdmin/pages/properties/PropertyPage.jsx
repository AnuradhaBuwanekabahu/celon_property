import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import RecordForm from '../../components/RecordForm';
import StatusBadge from '../../components/StatusBadge';
import { api } from '../../api/client';
import { btn, panel, panelHeader, dataTable, th, td, trHover, actionsCell, emptyState, loadingState, searchBar, searchInput, tabs, tabBtn } from '../../lib/ui';

export default function PropertyPage({ config }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [q, setQ] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'create' | record object
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

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
      const payload = Array.isArray(res) ? res : (res?.data || res?.lands || res?.rows || []);
      setRows(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setError(err.message);
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
      const payload = Array.isArray(res) ? res : (res?.data || res?.lands || res?.rows || []);
      setRows(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => { setForm({}); setModalMode('create'); };
  const openEdit = (row) => { setForm(row); setModalMode(row); };

  const save = async () => {
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

  return (
    <Layout eyebrow={config.eyebrow} title={config.title}>
      <div className={panel}>
        <div className={panelHeader}>
          <h2>{config.title} listings</h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <form className={searchBar} onSubmit={search}>
              <input className={searchInput} placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
              <button className={btn('ghost', { sm: true })} type="submit">Search</button>
            </form>
            <button className={btn('accent')} onClick={openCreate}>+ New listing</button>
          </div>
        </div>
        <div className={tabs}>
          {['all', ...config.statuses].map((s) => (
            <button key={s} className={tabBtn(statusFilter === s)} onClick={() => { setQ(''); setStatusFilter(s); }}>
              {s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={loadingState}>Loading listings…</div>
        ) : error ? (
          <div className="bg-danger-bg text-danger rounded-radius px-3 py-2.5 text-[12.5px]" style={{ margin: 20 }}>{error}</div>
        ) : (
          <table className={dataTable}>
            <thead>
              <tr>
                {config.columns.map((c) => <th key={c.key} className={th}>{c.label}</th>)}
                <th className={th}>Status</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className={trHover}>
                  {config.columns.map((c) => <td key={c.key} className={td}>{c.cell(r)}</td>)}
                  <td className={td}><StatusBadge status={r.status} /></td>
                  <td className={td}>
                    <div className={actionsCell}>
                      <select
                        value=""
                        onChange={(e) => e.target.value && updateStatus(r.id, e.target.value)}
                        disabled={busyId === r.id}
                        className="text-xs px-1.5 py-1 border border-line rounded-md"
                      >
                        <option value="">Set status…</option>
                        {config.statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button className={btn('ghost', { sm: true })} onClick={() => openEdit(r)}>Edit</button>
                      <button className={btn('danger', { sm: true })} onClick={() => remove(r.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={config.columns.length + 2}><div className={emptyState}>No listings in this view.</div></td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modalMode && (
        <Modal
          title={modalMode === 'create' ? `New ${config.title} listing` : `Edit — ${modalMode.title}`}
          onClose={() => setModalMode(null)}
          footer={
            <>
              <button className={btn('ghost')} onClick={() => setModalMode(null)}>Cancel</button>
              <button className={btn('primary')} disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save'}</button>
            </>
          }
        >
          <RecordForm fields={config.fields} values={form} onChange={setForm} />
        </Modal>
      )}
    </Layout>
  );
}
