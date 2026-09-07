import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import RecordForm from '../components/RecordForm';
import { api } from '../api/client';
import { btn, panel, panelHeader, dataTable, th, td, trHover, cellMono, actionsCell, emptyState, loadingState } from '../lib/ui';

const FIELDS = [
  { name: 'tier_order', label: 'Tier order', type: 'number', required: true },
  { name: 'limit_count', label: 'Listing limit', type: 'number', required: true },
  { name: 'price', label: 'Price (Rs)', type: 'number', required: true },
  { name: 'days', label: 'Active days', type: 'number', required: true },
];

export default function Limits() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({});
  const [modalMode, setModalMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/limits');
      setRows(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    const requiredFields = FIELDS.filter((field) => field.required);

    for (const field of requiredFields) {
      const rawValue = form[field.name];
      const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

      if (value === '' || value === null || value === undefined) {
        alert(`${field.label} is required.`);
        return;
      }

      const numericValue = Number(value);

      if (!Number.isFinite(numericValue)) {
        alert(`${field.label} must be a valid number.`);
        return;
      }

      if (field.name === 'tier_order' && numericValue <= 0) {
        alert('Tier order must be greater than 0.');
        return;
      }

      if ((field.name === 'limit_count' || field.name === 'price') && numericValue < 0) {
        alert(`${field.label} cannot be negative.`);
        return;
      }

      if (field.name === 'days' && numericValue <= 0) {
        alert('Active days must be greater than 0.');
        return;
      }
    }

    setSaving(true);

    try {
      const payload = requiredFields.reduce((acc, field) => {
        acc[field.name] = Number(form[field.name]);
        return acc;
      }, {});

      if (modalMode === 'create') await api.post('/limits', payload);
      else await api.put(`/limits/${modalMode.id}`, payload);

      setModalMode(null);
      await load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this listing limit?')) return;
    try {
      await api.del(`/limits/${id}`);
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Layout title="Listing Limits" eyebrow="Listings">
      <div className={panel}>
        <div className={panelHeader}>
          <div>
            <h2>Listing limit tiers</h2>
            <p>Control how many listings each tier allows.</p>
          </div>
          <button
            className={btn('accent')}
            onClick={() => {
              setForm({ tier_order: '', limit_count: '', price: '', days: 30 });
              setModalMode('create');
            }}
          >
            + New limit
          </button>
        </div>

        {loading ? (
          <div className={loadingState}>Loading limits...</div>
        ) : error ? (
          <div className="bg-danger-bg text-danger rounded-radius px-3 py-2.5 text-[12.5px]" style={{ margin: 20 }}>{error}</div>
        ) : (
          <table className={dataTable}>
            <thead>
              <tr>{['Tier', 'Listings', 'Price', 'Days', ''].map((heading) => <th className={th} key={heading}>{heading}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((limit) => (
                <tr className={trHover} key={limit.id}>
                  <td className={`${td} ${cellMono}`}>{limit.tier_order}</td>
                  <td className={`${td} ${cellMono}`}>{limit.limit_count}</td>
                  <td className={`${td} ${cellMono}`}>Rs {Number(limit.price).toLocaleString()}</td>
                  <td className={`${td} ${cellMono}`}>{limit.days}</td>
                  <td className={td}>
                    <div className={actionsCell}>
                      <button className={btn('ghost', { sm: true })} onClick={() => { setForm(limit); setModalMode(limit); }}>Edit</button>
                      <button className={btn('danger', { sm: true })} onClick={() => remove(limit.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={5}><div className={emptyState}>No listing limits configured.</div></td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {modalMode && (
        <Modal
          title={modalMode === 'create' ? 'New listing limit' : `Edit tier ${modalMode.tier_order}`}
          onClose={() => setModalMode(null)}
          footer={
            <>
              <button className={btn('ghost')} onClick={() => setModalMode(null)}>Cancel</button>
              <button className={btn('accent')} disabled={saving} onClick={save}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </>
          }
        >
          <RecordForm fields={FIELDS} values={form} onChange={setForm} />
        </Modal>
      )}
    </Layout>
  );
}