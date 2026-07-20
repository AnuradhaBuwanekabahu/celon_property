import React from 'react'
import {Routes ,Route} from 'react-router-dom'
import Home from './client/pages/Home';
import Login from './client/pages/login/Login';
import Register from './client/pages/login/Register';
import DashboardHome from './client/pages/dashboard/DashboardHome';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashnoardAddHotSales from './client/pages/dashboard/DashnoardAddHotSales';
import DashboardPayment from './client/pages/dashboard/Payment/DashboardPayment';
function  App(){
  return(
    <div>

         <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
         <Routes>
          <Route element={<Home/>} path="/"/>
          <Route element={<Login/>} path="/client-login"/>
          <Route element={<Register/>} path="/client-register"/>
          <Route element={<DashboardHome/>} path="/dashboard"/>
          
          {/* hotsales */}
          <Route element ={<DashnoardAddHotSales/>} path="/dashboard/add-hotsales"/>
           
           {/* payment */}

           <Route element={<DashboardPayment/>} path ="/dashboard/payment"/>
         </Routes>
    </div>
  )
}

export default App;
