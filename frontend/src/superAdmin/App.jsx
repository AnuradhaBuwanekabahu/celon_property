import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth, RequireSuperAdmin } from './components/RouteGuards';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admins from './pages/Admins';
import Clients from './pages/Clients';
import Payments from './pages/Payments';
import Ads from './pages/Ads';
import PropertyPage from './pages/properties/PropertyPage';
import Offers from './pages/Offers';
import AdLimits from './pages/AdLimits';
import { propertyConfigs } from './config/propertyConfigs';

import RegisterAdmin from '../admin/pages/adminAuth/RegisterAdmin';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<RegisterAdmin />} />
        <Route path="" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="clients" element={<RequireAuth><Clients /></RequireAuth>} />
        <Route path="payments" element={<RequireAuth><Payments /></RequireAuth>} />
        <Route path="ads" element={<RequireAuth><Ads /></RequireAuth>} />
        <Route path="admins" element={<RequireSuperAdmin><Admins /></RequireSuperAdmin>} />
        <Route path="offers" element={<RequireSuperAdmin><Offers /></RequireSuperAdmin>} />
        <Route path="ad-limits" element={<RequireSuperAdmin><AdLimits /></RequireSuperAdmin>} />

        {Object.values(propertyConfigs).map((config) => (
          <Route
            key={config.slug}
            path={config.basePath.replace(/^\//, '')}
            element={<RequireAuth><PropertyPage config={config} /></RequireAuth>}
          />
        ))}
      </Routes>
    </AuthProvider>
  );
}
