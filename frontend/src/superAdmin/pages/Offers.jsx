import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import {
  btn, panel, panelHeader, dataTable, th, td, trHover,
  cellTitle, cellSub, cellMono, actionsCell, emptyState,
  loadingState, tabs, tabBtn, stamp
} from '../lib/ui';
import { api } from '../api/client';

const TABS = [
  { key: 'all', label: 'All Offers' },
  { key: 'active', label: 'Active' },
  { key: 'inactive', label: 'Inactive' },
  { key: 'expired', label: 'Expired' },
];

const OFFER_TYPES = [
  { value: 'percentage', label: '% Percentage Discount' },
  { value: 'fixed', label: '💰 Fixed Amount Off' },
  { value: 'free_listing', label: '🆓 Free Listing' },
  { value: 'featured', label: '⭐ Featured Placement' },
];

const APPLICABLE_TO = [
  { value: 'all', label: 'All Listings' },
  { value: 'hot_sales', label: 'Hot Sales' },
  { value: 'lands', label: 'Lands' },
  { value: 'stays_to_buy', label: 'Stays to Buy' },
  { value: 'stays_to_rent', label: 'Stays to Rent' },
  { value: 'wanted', label: 'Wanted' },
];

const EMPTY_FORM = {
  title: '',
  description: '',
  offer_type: 'percentage',
  discount_percent: '',
  discount_amount: '',
  applicable_to: 'all',
  promo_code: '',
  start_date: '',
  end_date: '',
  max_uses: '',
  status: 'active',
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '600',
  color: '#14213D',
  marginBottom: '4px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #E2DDD5',
  borderRadius: '6px',
  fontSize: '13px',
  color: '#2C2C2C',
  background: '#FAFAF8',
  outline: 'none',
  boxSizing: 'border-box',
};

const selectStyle = { ...inputStyle };

export default function Offers() {
  const [tab, setTab] = useState('all');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editOffer, setEditOffer] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [actioningId, setActioningId] = useState(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/offers');
      setRows(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = rows.filter((r) => {
    const matchTab = tab === 'all' || r.status === tab;
    const matchSearch =
      !search ||
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.promo_code?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const openCreate = () => {
    setEditOffer(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (offer) => {
    setEditOffer(offer);
    setForm({
      title: offer.title || '',
      description: offer.description || '',
      offer_type: offer.offer_type || 'percentage',
      discount_percent: offer.discount_percent || '',
      discount_amount: offer.discount_amount || '',
      applicable_to: offer.applicable_to || 'all',
      promo_code: offer.promo_code || '',
      start_date: offer.start_date ? offer.start_date.split('T')[0] : '',
      end_date: offer.end_date ? offer.end_date.split('T')[0] : '',
      max_uses: offer.max_uses || '',
      status: offer.status || 'active',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return alert('Title is required');
    if (!form.start_date || !form.end_date) return alert('Start date and End date are required');

    setSaving(true);
    try {
      if (editOffer) {
        await api.put(`/offers/${editOffer.id}`, form);
      } else {
        await api.post('/offers', form);
      }
      setShowModal(false);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusToggle = async (offer) => {
    const newStatus = offer.status === 'active' ? 'inactive' : 'active';
    setActioningId(offer.id);
    try {
      await api.patch(`/offers/${offer.id}/status`, { status: newStatus });
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setActioningId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this offer permanently?')) return;
    setActioningId(id);
    try {
      await api.del(`/offers/${id}`);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setActioningId(null);
    }
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB') : '—');

  const getDiscountDisplay = (offer) => {
    if (offer.offer_type === 'percentage') return `${offer.discount_percent}% off`;
    if (offer.offer_type === 'fixed') return `Rs. ${Number(offer.discount_amount).toLocaleString()} off`;
    if (offer.offer_type === 'free_listing') return 'Free Listing';
    if (offer.offer_type === 'featured') return 'Featured';
    return '—';
  };

  return (
    <Layout title="Offers">
      {/* Header banner */}
      <div style={{
        background: 'linear-gradient(135deg, #14213D 0%, #C1622D 100%)',
        borderRadius: '10px',
        padding: '20px 24px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: 700 }}>
            🎁 Special Offers
          </h1>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}>
            Manage promotional offers and promo codes for clients
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '8px',
            padding: '8px 16px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#FBBF24', fontSize: '22px', fontWeight: 700, lineHeight: 1 }}>
              {rows.filter(r => r.status === 'active').length}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', marginTop: '2px' }}>Active</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '8px',
            padding: '8px 16px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#86efac', fontSize: '22px', fontWeight: 700, lineHeight: 1 }}>
              {rows.length}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', marginTop: '2px' }}>Total</div>
          </div>
          <button className={btn('accent')} onClick={openCreate} style={{
            background: '#FBBF24',
            color: '#14213D',
            fontWeight: 700,
            border: 'none',
          }}>
            + New Offer
          </button>
        </div>
      </div>

      <div className={panel}>
        {/* Search + Tabs */}
        <div className={panelHeader}>
          <input
            type="text"
            placeholder="Search by title or promo code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '7px 12px',
              border: '1px solid #E2DDD5',
              borderRadius: '6px',
              fontSize: '13px',
              minWidth: '240px',
              background: '#FAFAF8',
            }}
          />
        </div>
        <div className={tabs}>
          {TABS.map((t) => (
            <button key={t.key} className={tabBtn(tab === t.key)} onClick={() => setTab(t.key)}>
              {t.label}
              <span style={{
                marginLeft: '6px',
                background: tab === t.key ? '#C1622D' : '#E2DDD5',
                color: tab === t.key ? '#fff' : '#666',
                borderRadius: '999px',
                padding: '1px 7px',
                fontSize: '11px',
              }}>
                {t.key === 'all' ? rows.length : rows.filter(r => r.status === t.key).length}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className={loadingState}>Loading offers…</div>
        ) : error ? (
          <div style={{ padding: '20px', color: '#C84B31' }}>{error}</div>
        ) : (
          <table className={dataTable}>
            <thead>
              <tr>
                <th className={th}>Title</th>
                <th className={th}>Type</th>
                <th className={th}>Discount</th>
                <th className={th}>Promo Code</th>
                <th className={th}>Applies To</th>
                <th className={th}>Valid Period</th>
                <th className={th}>Uses</th>
                <th className={th}>Status</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((offer) => (
                <tr key={offer.id} className={trHover}>
                  <td className={`${td} ${cellTitle}`}>
                    {offer.title}
                    {offer.description && (
                      <div className={cellSub} style={{ fontWeight: 400 }}>
                        {offer.description.slice(0, 50)}{offer.description.length > 50 ? '…' : ''}
                      </div>
                    )}
                  </td>
                  <td className={td}>
                    <span style={{
                      background: '#F0EDE8',
                      borderRadius: '5px',
                      padding: '2px 8px',
                      fontSize: '11.5px',
                      color: '#14213D',
                    }}>
                      {OFFER_TYPES.find(t => t.value === offer.offer_type)?.label?.replace(/^.+?\s/, '') || offer.offer_type}
                    </span>
                  </td>
                  <td className={`${td} ${cellMono}`} style={{ fontWeight: 600, color: '#C1622D' }}>
                    {getDiscountDisplay(offer)}
                  </td>
                  <td className={td}>
                    {offer.promo_code ? (
                      <span style={{
                        fontFamily: 'monospace',
                        background: '#FEF3C7',
                        color: '#92400E',
                        padding: '2px 8px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        letterSpacing: '0.05em',
                        fontWeight: 700,
                      }}>
                        {offer.promo_code}
                      </span>
                    ) : <span className={cellSub}>—</span>}
                  </td>
                  <td className={`${td} ${cellSub}`}>
                    {APPLICABLE_TO.find(a => a.value === offer.applicable_to)?.label || offer.applicable_to}
                  </td>
                  <td className={`${td} ${cellSub}`}>
                    <div>{formatDate(offer.start_date)}</div>
                    <div style={{ color: isExpired(offer.end_date) ? '#C84B31' : 'inherit' }}>
                      → {formatDate(offer.end_date)}
                      {isExpired(offer.end_date) && <span style={{ marginLeft: 4 }}>⚠️</span>}
                    </div>
                  </td>
                  <td className={`${td} ${cellMono}`}>
                    {offer.used_count || 0}
                    {offer.max_uses ? ` / ${offer.max_uses}` : ''}
                  </td>
                  <td className={td}>
                    <span className={stamp(offer.status)}>{offer.status}</span>
                  </td>
                  <td className={td}>
                    <div className={actionsCell}>
                      <button
                        className={btn('ghost', { sm: true })}
                        onClick={() => openEdit(offer)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className={btn(offer.status === 'active' ? 'default' : 'primary', { sm: true })}
                        disabled={actioningId === offer.id}
                        onClick={() => handleStatusToggle(offer)}
                        title={offer.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {offer.status === 'active' ? 'Pause' : 'Activate'}
                      </button>
                      <button
                        className={btn('danger', { sm: true })}
                        disabled={actioningId === offer.id}
                        onClick={() => handleDelete(offer.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9}>
                    <div className={emptyState}>
                      <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎁</div>
                      No offers found. Create your first offer!
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <Modal
          title={editOffer ? 'Edit Offer' : 'Create New Offer'}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className={btn('ghost')} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={btn('primary')} disabled={saving} onClick={handleSave}>
                {saving ? 'Saving…' : editOffer ? 'Update Offer' : 'Create Offer'}
              </button>
            </>
          }
        >
          <div style={{ display: 'grid', gap: '14px' }}>

            {/* Title */}
            <div>
              <label style={labelStyle}>Title *</label>
              <input
                style={inputStyle}
                placeholder="e.g. Summer Sale 2025"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                style={{ ...inputStyle, resize: 'vertical', minHeight: '70px' }}
                placeholder="Brief description about this offer…"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Offer Type + Applicable To */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Offer Type *</label>
                <select
                  style={selectStyle}
                  value={form.offer_type}
                  onChange={(e) => setForm({ ...form, offer_type: e.target.value })}
                >
                  {OFFER_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Applies To</label>
                <select
                  style={selectStyle}
                  value={form.applicable_to}
                  onChange={(e) => setForm({ ...form, applicable_to: e.target.value })}
                >
                  {APPLICABLE_TO.map(a => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Discount values */}
            {(form.offer_type === 'percentage') && (
              <div>
                <label style={labelStyle}>Discount % *</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 20"
                  value={form.discount_percent}
                  onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                />
              </div>
            )}
            {(form.offer_type === 'fixed') && (
              <div>
                <label style={labelStyle}>Discount Amount (Rs.) *</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  placeholder="e.g. 5000"
                  value={form.discount_amount}
                  onChange={(e) => setForm({ ...form, discount_amount: e.target.value })}
                />
              </div>
            )}

            {/* Promo Code + Max Uses */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Promo Code</label>
                <input
                  style={{ ...inputStyle, textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.05em' }}
                  placeholder="e.g. SUMMER25"
                  value={form.promo_code}
                  onChange={(e) => setForm({ ...form, promo_code: e.target.value.toUpperCase() })}
                />
              </div>
              <div>
                <label style={labelStyle}>Max Uses (optional)</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="1"
                  placeholder="Unlimited if blank"
                  value={form.max_uses}
                  onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                />
              </div>
            </div>

            {/* Start + End Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Start Date *</label>
                <input
                  style={inputStyle}
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                />
              </div>
              <div>
                <label style={labelStyle}>End Date *</label>
                <input
                  style={inputStyle}
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label style={labelStyle}>Status</label>
              <select
                style={selectStyle}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

          </div>
        </Modal>
      )}
    </Layout>
  );
}
