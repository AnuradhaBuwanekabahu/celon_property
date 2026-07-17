import React from 'react'
import {Routes ,Route} from 'react-router-dom'
import Home from './client/pages/Home';
import Login from './client/pages/login/Login';
import Register from './client/pages/login/Register';
import DashboardHome from './client/pages/dashboard/DashboardHome';
function  App(){
  return(
    <div>
         <Routes>
          <Route element={<Home/>} path="/"/>
          <Route element={<Login/>} path="/client-login"/>
          <Route element={<Register/>} path="/client-register"/>
          <Route element={<DashboardHome/>} path="/dashboard"/>
         </Routes>
    </div>
  )
}

export default App;
