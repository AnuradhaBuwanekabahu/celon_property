import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { panel, panelHeader, panelHeaderMeta, statGrid, dataTable, th, td, trHover, cellTitle, cellMono, emptyState, loadingState } from '../lib/ui';

export default function Dashboard() {
  const { isSuperAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isSuperAdmin);

  useEffect(() => {
    if (!isSuperAdmin) return;
    (async () => {
      try {
        const [sysRes, actRes] = await Promise.all([
          api.get('/system-stats'),
          api.get('/recent-activity')
        ]);
        setStats(sysRes.data);
        setActivity(actRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [isSuperAdmin]);

  return (
    <Layout  title="Dashboard">
      {!isSuperAdmin ? (
        <div className={panel}>
          <div className={emptyState}>
            <p>Welcome back. Full system statistics are visible to Super Admins only —
              use the sidebar to manage listings, clients and payments.</p>
          </div>
        </div>
      ) : loading ? (
        <div className={loadingState}>Reading the ledger…</div>
      ) : error ? (
        <div className="bg-danger-bg text-danger rounded-radius px-3 py-2.5 text-[12.5px] mb-4">{error}</div>
      ) : (
        <>
          <div className={statGrid}>
            <StatCard  label="Total clients" value={stats.total_clients} />
            <StatCard  label="Hot sales" value={stats.total_properties.hot_sales} />
            <StatCard  label="Stays to buy" value={stats.total_properties.stays_to_buy} />
            <StatCard  label="Stays to rent" value={stats.total_properties.stays_to_rent} />
            <StatCard  label="Land parcels" value={stats.total_properties.land} />
            <StatCard  label="Wanted requests" value={stats.total_properties.wanted} />
            <StatCard  label="Payments logged" value={stats.total_payments} />
            <StatCard  label="Revenue collected" value={`Rs ${Number(stats.total_revenue).toLocaleString()}`} />
          </div>

          <div className={panel} style={{ marginBottom: 20 }}>
            <div className={panelHeader}>
              <h2>Recently listed properties</h2>
              <span className={panelHeaderMeta}>{activity.recent_properties.length} entries</span>
            </div>
            <div className="overflow-x-auto">
              <table className={`${dataTable} min-w-[680px]`}>
                <thead>
                  <tr><th className={th}>Title</th><th className={th}>Type</th><th className={th}>Client</th><th className={th}>City</th><th className={th}>Price</th></tr>
                </thead>
                <tbody>
                  {activity.recent_properties.map((p) => (
                    <tr key={`${p.type}-${p.id}`} className={trHover}>
                      <td className={`${td} ${cellTitle}`}>{p.title}</td>
                      <td className={td}>{p.type}</td>
                      <td className={td}>{p.client_name}</td>
                      <td className={td}>{p.city}</td>
                      <td className={`${td} ${cellMono}`}>Rs {Number(p.price || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                  {activity.recent_properties.length === 0 && (
                    <tr><td colSpan={5} className={emptyState}>No properties yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={panel}>
            <div className={panelHeader}>
              <h2>Recently joined clients</h2>
              <span className={panelHeaderMeta}>{activity.recent_clients.length} entries</span>
            </div>
            <div className="overflow-x-auto">
              <table className={`${dataTable} min-w-[520px]`}>
                <thead>
                  <tr><th className={th}>Full name</th><th className={th}>Email</th><th className={th}>Phone</th></tr>
                </thead>
                <tbody>
                  {activity.recent_clients.map((c) => (
                    <tr key={c.id} className={trHover}>
                      <td className={`${td} ${cellTitle}`}>{c.full_name}</td>
                      <td className={td}>{c.email}</td>
                      <td className={`${td} ${cellMono}`}>{c.phone_number}</td>
                    </tr>
                  ))}
                  {activity.recent_clients.length === 0 && (
                    <tr><td colSpan={3} className={emptyState}>No clients yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
