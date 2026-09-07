import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../api/client';
import { btn, panel, panelHeader, loadingState } from '../lib/ui';

const DEFAULT_LIMITS = [
  { tier_order: 1, limit_count: 3, price: 0, days: 30 },
  { tier_order: 2, limit_count: 10, price: 0, days: 30 },
  { tier_order: 3, limit_count: 20, price: 0, days: 30 },
];

export default function AdLimits() {
  const [form, setForm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/ad-limits');
      const limits = (res.limits || []).map((limit) => ({ ...limit }));
      setForm(limits.length ? limits : DEFAULT_LIMITS.map((limit) => ({ ...limit })));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateField = (index, field, value) => {
    setForm((previous) => previous.map((limit, itemIndex) => (
      itemIndex === index ? { ...limit, [field]: value } : limit
    )));
    setSuccess('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.put('/ad-limits', { limits: form });
      setSuccess('Ad limits updated successfully.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Ad Limits" eyebrow="Settings">
      <div style={{ maxWidth: 720 }}>
        <div className={panel}>
          <div className={panelHeader}>
            <div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Ad Limit Configuration</h2>
              <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#6b7280' }}>Configure each pricing tier from the limits table.</p>
            </div>
            <button className={btn('accent')} onClick={handleSave} disabled={saving || loading}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          {error && <div style={{ margin: '0 20px 16px', padding: 10, color: '#b91c1c', background: '#fef2f2', borderRadius: 8 }}>{error}</div>}
          {success && <div style={{ margin: '0 20px 16px', padding: 10, color: '#15803d', background: '#f0fdf4', borderRadius: 8 }}>{success}</div>}
          {loading ? <div className={loadingState}>Loading ad limits...</div> : (
            <div style={{ padding: '4px 20px 24px', display: 'grid', gap: 16 }}>
              {form.map((limit, index) => (
                <div key={limit.id} style={{ paddingBottom: 16, borderBottom: '1px solid #e5e7eb' }}>
                  <strong>Tier {limit.tier_order}</strong>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ marginTop: 10 }}>
                    {['limit_count', 'price', 'days'].map((field) => (
                      <label key={field} style={{ display: 'grid', gap: 4, fontSize: 12, textTransform: 'capitalize' }}>
                        {field.replace('_', ' ')}
                        <input
                          type="number"
                          min={field === 'days' ? 1 : 0}
                          value={limit[field] ?? ''}
                          onChange={(event) => updateField(index, field, event.target.value)}
                          style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 7 }}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
