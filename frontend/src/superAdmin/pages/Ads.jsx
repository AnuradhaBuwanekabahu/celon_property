import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import RecordForm from '../components/RecordForm';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { btn, panel, panelHeader, dataTable, th, td, trHover, cellTitle, cellMono, actionsCell, emptyState, loadingState, stamp } from '../lib/ui';

const FIELDS = [
  { name: 'title', label: 'Title' },
  { name: 'admin_id', label: 'Admin ID', required: true, help: 'Numeric id of the admin who owns this ad' },
  { name: 'image_url', label: 'Image URL', required: true },
  { name: 'link_url', label: 'Link URL' },
  {
    name: 'position',
    label: 'Position',
    type: 'select',
    options: [
      { value: 'front_page_bottom', label: 'Home page (bottom)' },
      { value: 'sub_pages', label: 'Other pages (sidebar)' },
      { value: 'front_page_top', label: 'Home page (top)' }
    ]
  }
];

export default function Ads() {
  const { admin } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'create' | record
  const [form, setForm] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/ads');
      const payload = Array.isArray(res) ? res : (res?.data || res?.ads || []);
      setRows(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ admin_id: admin?.id || '', position: 'front_page_bottom' });
    setImageFile(null);
    setModalMode('create');
  };

  const openEdit = (ad) => {
    setForm(ad);
    setImageFile(null);
    setModalMode(ad);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append('title', form.title || '');
      payload.append('link_url', form.link_url || '');
      payload.append('position', form.position ?? 0);
      if (form.admin_id) payload.append('admin_id', String(form.admin_id));
      if (form.created_by) payload.append('created_by', String(form.created_by));
      if (form.image_url) payload.append('image_url', form.image_url);
      if (imageFile) payload.append('image', imageFile);

      if (modalMode === 'create') {
        await api.post('/ads', payload);
      } else {
        await api.put(`/ads/${modalMode.id}`, payload);
      }
      setModalMode(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (ad) => {
    try {
      await api.patch(`/ads/${ad.id}/toggle`, { is_active: !ad.is_active });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this ad?')) return;
    try {
      await api.del(`/ads/${id}`);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Layout  title="Ads">
      <div className={panel}>
        <div className={panelHeader}>
          <h2>Banner ads</h2>
          <button className={btn('accent')} onClick={openCreate}>+ New ad</button>
        </div>

        {loading ? (
          <div className={loadingState}>Loading ads…</div>
        ) : error ? (
          <div className="bg-danger-bg text-danger rounded-radius px-3 py-2.5 text-[12.5px]" style={{ margin: 20 }}>{error}</div>
        ) : (
          <table className={dataTable}>
            <thead>
              <tr><th className={th}>Title</th><th className={th}>Position</th><th className={th}>Link</th><th className={th}>Status</th><th className={th}></th></tr>
            </thead>
            <tbody>
              {rows.map((ad) => (
                <tr key={ad.id} className={trHover}>
                  <td className={`${td} ${cellTitle}`}>{ad.title || '(untitled)'}</td>
                  <td className={`${td} ${cellMono}`}>{ad.position}</td>
                  <td className={td} style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ad.link_url || '—'}</td>
                  <td className={td}><span className={stamp(ad.is_active ? 'active' : 'sold')}>{ad.is_active ? 'active' : 'paused'}</span></td>
                  <td className={td}>
                    <div className={actionsCell}>
                      <button className={btn('ghost', { sm: true })} onClick={() => toggle(ad)}>{ad.is_active ? 'Pause' : 'Activate'}</button>
                      <button className={btn('ghost', { sm: true })} onClick={() => openEdit(ad)}>Edit</button>
                      <button className={btn('danger', { sm: true })} onClick={() => remove(ad.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5}><div className={emptyState}>No ads yet — add the first banner.</div></td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modalMode && (
        <Modal
          title={modalMode === 'create' ? 'New ad' : `Edit — ${modalMode.title || 'Ad #' + modalMode.id}`}
          onClose={() => setModalMode(null)}
          footer={
            <>
              <button className={btn('ghost')} onClick={() => setModalMode(null)}>Cancel</button>
              <button className={btn('primary')} disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save'}</button>
            </>
          }
        >
          <RecordForm fields={FIELDS} values={form} onChange={setForm} />
          <div className="mt-4">
            <label className="block text-xs font-medium text-ink-soft mb-[5px]" htmlFor="image-file">Image file</label>
            <input
              id="image-file"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-[13.5px] font-body text-ink"
            />
            <div className="text-[11.5px] text-ink-soft mt-1">You can upload a file here, or provide an image URL in the form above.</div>
          </div>
        </Modal>
      )}
    </Layout>
  );
}