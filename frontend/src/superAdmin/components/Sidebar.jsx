import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { group: 'Overview', links: [
    { to: '/superadmin/', label: 'Dashboard' }
  ]},
  { group: 'Listings', links: [
    { to: '/admin/properties/hot-sales', label: 'Hot Sales' },
    { to: '/admin/properties/stays-to-buy', label: 'Stays to Buy' },
    { to: '/admin/properties/stays-to-rent', label: 'Stays to Rent' },
    { to: '/admin/properties/land', label: 'Land' },
    { to: '/admin/properties/wanted', label: 'Wanted' }
  ]},
  { group: 'People & Money', links: [
    { to: '/superadmin/clients', label: 'Clients' },
    { to: '/superadmin/payments', label: 'Payments' },
    { to: '/superadmin/ads', label: 'Ads' }
  ]},
  { group: 'Administration', links: [
    { to: '/admin/admins', label: 'Admins', superOnly: true },
    { to: '/admin/offers', label: '🎁 Offers', superOnly: true },
    { to: '/admin/ad-limits', label: '⚙️ Ad Limits', superOnly: true }
  ]}
];

export default function Sidebar({ open, onClose }) {
  const { admin, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(isSuperAdmin ? '/superadmin/login' : '/admin/login');
  };

  // Super Admin සහ Normal Admin routes dynamically generate කරන function එක
  const getNavPath = (path) => {
    if (isSuperAdmin) {
      // Super admin සඳහා prefix එක `/superadmin` ලෙස වෙනස් වේ
      return path.startsWith('/admin') ? path.replace('/admin', '/superadmin') : path;
    }
    // Normal admin සඳහා prefix එක `/admin` ලෙසම පවතී (තවද /dashboard -> /admin/dashboard)
    if (path === '/dashboard') return '/admin/dashboard';
    return path;
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col py-6 bg-[#14213D] text-[#E9E4D6] shrink-0 min-h-screen overflow-y-auto transition-transform duration-300 md:static md:translate-x-0 md:flex ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="px-[22px] pb-6 mb-[18px] border-b border-[#E9E4D6]/[0.14] flex items-center justify-between">
          <div className="font-display text-[20px] font-bold text-[#F6F1E6] tracking-[0.01em]">
            {isSuperAdmin ? 'Super Admin' : 'Admin Portal'}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white transition hover:border-white/40"
          >
            ×
          </button>
        </div>

        <nav>
          {NAV.map((section) => {
            const links = section.links.filter((l) => !l.superOnly || isSuperAdmin);
            if (links.length === 0) return null;
            return (
              <div key={section.group}>
                <div className="text-[10.5px] uppercase tracking-[0.12em] text-[#E9E4D6]/45 px-[22px] pt-[14px] pb-[6px]">
                  {section.group}
                </div>
                {links.map((l) => {
                  const targetPath = getNavPath(l.to);
                  return (
                    <NavLink
                      key={l.to}
                      to={targetPath}
                      end={targetPath === '/superadmin' || targetPath === '/admin/dashboard'}
                      className={({ isActive }) =>
                        'flex items-center gap-2.5 px-[22px] py-[9px] text-[13.5px] no-underline border-l-[3px] transition-colors duration-150 ease-in-out ' +
                        (isActive
                          ? 'bg-[#C1622D]/[0.16] border-l-clay text-white font-medium'
                          : 'border-l-transparent text-[#E9E4D6]/[0.82] hover:bg-[#E9E4D6]/[0.06] hover:text-white')
                      }
                      onClick={onClose}
                    >
                      <span className="font-mono text-[10px] opacity-60 w-4">{l.idx}</span>
                      {l.label}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 px-[22px] border-t border-[#E9E4D6]/[0.14]">
          <div className="text-[12.5px] text-[#E9E4D6]/80">
            <strong className="text-white block text-[13.5px]">{admin?.name || admin?.Name}</strong>
            {admin?.email}
          </div>
          <span className="inline-block mt-1.5 text-[10px] uppercase tracking-[0.08em] px-2 py-0.5 rounded-[20px] bg-gold text-teal-deep font-semibold">
            {isSuperAdmin ? 'Super Admin' : 'Admin'}
          </span>
          <button
            className="mt-3 w-full bg-transparent border border-[#E9E4D6]/25 text-[#E9E4D6]/[0.85] py-[7px] rounded-radius text-[12.5px] hover:border-clay hover:text-white"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}