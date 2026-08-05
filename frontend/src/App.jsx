import React from 'react'
import {Routes ,Route} from 'react-router-dom'
import Home from './client/pages/Home';
import Login from './client/pages/login/Login';
import Register from './client/pages/login/Register';
import DashboardHome from './client/pages/dashboard/DashboardHome';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashnoardAddHotSales from './client/pages/dashboard/HotSales/DashnoardAddHotSales';
import DashboardPayment from './client/Routes/DashboardPayment';
import PaymentSuccess from './client/components/PaymentSuccess';
import SuperAdminApp from './superAdmin/App';

function App(){
  return(
    <div>

         <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggables
      />
         <Routes>
          <Route element={<Home/>} path="/"/>
          <Route element={<Login/>} path="/client-login"/>
          <Route element={<Register/>} path="/client-register"/>
          <Route element={<DashboardHome/>} path="/dashboard"/>
          
          {/* hotsales */}
          <Route element ={<DashnoardAddHotSales/>} path="/dashboard/add-hotsales"/>
           
           {/* payment */}

           <Route element={<DashboardPayment/>} path="/dashboard/payment"/>
           <Route path="/payment-success" element={<PaymentSuccess />} />

           {/* Super Admin */}
           <Route path="/admin/*" element={<SuperAdminApp />} />
         </Routes>
    </div>
  )
}

export default App;
