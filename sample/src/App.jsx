import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from 'react-router-dom'
import './App.css'
import LoginAdmin from './admin/pages/adminAuth/LoginAdmin'
import RegisterAdmin from './admin/pages/adminAuth/RegisterAdmin'
import ProtectedRoute from './superadmin/components/protectedRoute'
import AdminDashboard from './admin/pages/Dashboard/Dashboard'
import LoginSuperAdmin from './superadmin/pages/login/login'
import SuperAdminDashboard from './superadmin/pages/dashboard/dashboardHome'
import AdminRoutes from "./admin/routes/AdminRoutes";
import ProtectedRouted from "./admin/routes/ProtectedRoute";



function App() {
  

  return (
  
  <div>

<Routes>
  

        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/register" element={<RegisterAdmin />} />
       
        
         <Route path="/admin/*" element={
           <ProtectedRouted>
          <AdminRoutes />
          </ProtectedRouted>
          } />

       
       




</Routes>
       
<ToastContainer
        position="top-right"
        autoClose={3000}
/>

</div>


  )
}

export default App
