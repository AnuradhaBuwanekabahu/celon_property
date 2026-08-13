import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import StatCard from '../components/StatCard';
import { api } from '../api/client';
import { btn, panel, panelHeader, panelHeaderMeta, statGrid, dataTable, th, td, trHover, cellTitle, cellSub, cellMono, actionsCell, emptyState, loadingState, tabs, tabBtn } from '../lib/ui';

const STATUSES = ['all', 'pending', 'paid', 'failed'];

export default function Payments() {
  const [rows, setRows] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = statusFilter === 'all'
        ? await api.get('/payments')
        : await api.get(`/payments/status/${statusFilter}`);
      const payload = Array.isArray(res) ? res : (res?.data || res?.payments || []);
      setRows(Array.isArray(payload) ? payload : []);
      try {
        const rev = await api.get('/payments/admin/total-revenue');
        const revenueValue = rev?.data?.total_revenue ?? rev?.total_revenue ?? rev?.stats?.totalRevenue;
        setRevenue(revenueValue ?? null);
      } catch { /* non-super admin may not have access */ }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [statusFilter]);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    try {
      await api.patch(`/payments/${id}/status`, { status });
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this payment record?')) return;
    try {
      await api.del(`/payments/${id}`);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Layout  title="Payments">
      {revenue !== null && (
        <div className={statGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 240px))' }}>
          <StatCard index="Rs" label="Total revenue collected" value={`Rs ${Number(revenue).toLocaleString()}`} />
        </div>
      )}

      <div className={panel}>
        <div className={panelHeader}>
          <h2>Payment records</h2>
          <span className={panelHeaderMeta}>{rows.length} entries</span>
        </div>
        <div className={tabs}>
          {STATUSES.map((s) => (
            <button key={s} className={tabBtn(statusFilter === s)} onClick={() => setStatusFilter(s)}>
              {s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={loadingState}>Loading payments…</div>
        ) : error ? (
          <div className="bg-danger-bg text-danger rounded-radius px-3 py-2.5 text-[12.5px]" style={{ margin: 20 }}>{error}</div>
        ) : (
          <table className={dataTable}>
            <thead>
              <tr><th className={th}>Client</th><th className={th}>Property</th><th className={th}>Amount</th><th className={th}>Method</th><th className={th}>Status</th><th className={th}>Logged</th><th className={th}></th></tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className={trHover}>
                  <td className={`${td} ${cellMono}`}>#{p.client_id}</td>
                  <td className={td}>
                    <div className={cellTitle}>{p.property_type}</div>
                    <div className={cellSub}>record #{p.property_id}</div>
                  </td>
                  <td className={`${td} ${cellMono}`}>Rs {Number(p.amount).toLocaleString()}</td>
                  <td className={td}>{p.payment_method || '—'}</td>
                  <td className={td}><StatusBadge status={p.status} /></td>
                  <td className={`${td} ${cellSub} ${cellMono}`}>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className={td}>
                    <div className={actionsCell}>
                      {p.status !== 'paid' && (
                        <button className={btn('primary', { sm: true })} disabled={busyId === p.id} onClick={() => updateStatus(p.id, 'paid')}>Mark paid</button>
                      )}
                      {p.status !== 'failed' && (
                        <button className={btn('danger', { sm: true })} disabled={busyId === p.id} onClick={() => updateStatus(p.id, 'failed')}>Mark failed</button>
                      )}
                      <button className={btn('ghost', { sm: true })} onClick={() => remove(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={7}><div className={emptyState}>No payments in this view.</div></td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
