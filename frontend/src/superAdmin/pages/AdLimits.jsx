import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../api/client';
import { btn, panel, panelHeader, loadingState } from '../lib/ui';

const FIELDS = [
  {
    name: 'free_ad_limit',
    label: 'Free Ad Limit',
    help: 'Number of ads a client can post for free',
    icon: '🎁',
  },
  {
    name: 'second_limit',
    label: 'Second Tier Limit',
    help: 'Max ads allowed at the second pricing tier',
    icon: '📦',
  },
  {
    name: 'second_limit_charge',
    label: 'Second Tier Charge (Rs)',
    help: 'Amount charged per ad beyond the free limit',
    icon: '💰',
    decimal: true,
  },
  {
    name: 'third_limit',
    label: 'Third Tier Limit',
    help: 'Max ads allowed at the third pricing tier',
    icon: '🏷️',
  },
  {
    name: 'third_limit_charge',
    label: 'Third Tier Charge (Rs)',
    help: 'Amount charged per ad beyond the second tier',
    icon: '💳',
    decimal: true,
  },
];

export default function AdLimits() {
  const [limits, setLimits] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/ad-limits');
      const data = res?.limits || res;
      setLimits(data);
      setForm({
        free_ad_limit: data?.free_ad_limit ?? '',
        second_limit: data?.second_limit ?? '',
        second_limit_charge: data?.second_limit_charge ?? '',
        third_limit: data?.third_limit ?? '',
        third_limit_charge: data?.third_limit_charge ?? '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.put('/ad-limits', form);
      setSuccess('✅ Ad limits updated successfully!');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Ad Limits" eyebrow="Settings">
      <div style={{ maxWidth: 680 }}>

        {/* Header card */}
        <div className={panel} style={{ marginBottom: 24 }}>
          <div className={panelHeader}>
            <div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Ad Limit Configuration</h2>
              <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--color-ink-soft, #6b7280)' }}>
                Control how many ads clients can post and what charges apply.
              </p>
            </div>
            <button
              className={btn('accent')}
              onClick={handleSave}
              disabled={saving || loading}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>

          {/* Alert messages */}
          {error && (
            <div style={{ margin: '0 20px 16px', padding: '10px 14px', background: '#fef2f0', color: '#b91c1c', borderRadius: 8, fontSize: 13, border: '1px solid #fecaca' }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{ margin: '0 20px 16px', padding: '10px 14px', background: '#f0fdf4', color: '#15803d', borderRadius: 8, fontSize: 13, border: '1px solid #bbf7d0' }}>
              {success}
            </div>
          )}

          {/* Form body */}
          {loading ? (
            <div className={loadingState}>Loading ad limits…</div>
          ) : (
            <div style={{ padding: '4px 20px 24px' }}>

              {/* Tier cards */}
              <div style={{ display: 'grid', gap: 16, marginTop: 8 }}>

                {/* Free tier */}
                <TierCard
                  icon="🎁"
                  title="Free Tier"
                  accent="#14213D"
                  fields={[FIELDS[0]]}
                  form={form}
                  onChange={handleChange}
                />

                {/* Second tier */}
                <TierCard
                  icon="📦"
                  title="Second Tier"
                  accent="#C1622D"
                  fields={[FIELDS[1], FIELDS[2]]}
                  form={form}
                  onChange={handleChange}
                />

                {/* Third tier */}
                <TierCard
                  icon="🏷️"
                  title="Third Tier"
                  accent="#7c3aed"
                  fields={[FIELDS[3], FIELDS[4]]}
                  form={form}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Summary preview */}
        {!loading && limits && (
          <div className={panel}>
            <div className={panelHeader}>
              <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Current Active Limits</h2>
            </div>
            <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
              <SummaryItem label="Free ads" value={limits.free_ad_limit} suffix="ads" color="#14213D" />
              <SummaryItem label="2nd tier cap" value={limits.second_limit} suffix="ads" color="#C1622D" />
              <SummaryItem label="2nd tier charge" value={`Rs ${Number(limits.second_limit_charge).toLocaleString()}`} color="#C1622D" />
              <SummaryItem label="3rd tier cap" value={limits.third_limit} suffix="ads" color="#7c3aed" />
              <SummaryItem label="3rd tier charge" value={`Rs ${Number(limits.third_limit_charge).toLocaleString()}`} color="#7c3aed" />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

// ── Sub-components ───────────────────────────────────────────

function TierCard({ icon, title, accent, fields, form, onChange }) {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      {/* Card header strip */}
      <div style={{
        background: accent,
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{title}</span>
      </div>

      {/* Fields */}
      <div style={{
        padding: '14px 16px',
        display: 'grid',
        gridTemplateColumns: fields.length > 1 ? '1fr 1fr' : '1fr',
        gap: 14,
        background: '#fff',
      }}>
        {fields.map((f) => (
          <div key={f.name}>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {f.label}
            </label>
            <div style={{ position: 'relative' }}>
              {f.decimal && (
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#9ca3af', pointerEvents: 'none' }}>Rs</span>
              )}
              <input
                type="number"
                min="0"
                step={f.decimal ? '0.01' : '1'}
                value={form[f.name] ?? ''}
                onChange={(e) => onChange(f.name, e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: f.decimal ? '8px 10px 8px 30px' : '8px 10px',
                  border: '1px solid #d1d5db',
                  borderRadius: 7,
                  fontSize: 13.5,
                  outline: 'none',
                  background: '#f9fafb',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.target.style.borderColor = accent)}
                onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
              />
            </div>
            {f.help && (
              <p style={{ margin: '4px 0 0', fontSize: 11, color: '#9ca3af' }}>{f.help}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryItem({ label, value, suffix = '', color }) {
  return (
    <div style={{
      background: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      padding: '12px 14px',
    }}>
      <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: 'monospace' }}>
        {value} <span style={{ fontSize: 12, fontWeight: 400, color: '#6b7280' }}>{suffix}</span>
      </div>
    </div>
  );
}
