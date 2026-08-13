import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './client/pages/Home';
import Login from './client/pages/login/Login';
import Register from './client/pages/login/Register';
import DashboardHome from './client/pages/dashboard/DashboardHome';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashnoardAddHotSales from './client/pages/dashboard/HotSales/DashnoardAddHotSales';
import DashboardPayment from './client/Routes/DashboardPayment';
import PaymentSuccess from './client/components/PaymentSuccess';
import DashBoardProfile from './client/pages/login/DashBoardProfile';
import DashboardEditProfile from './client/pages/login/DashboardEditProfile';
import DashboardEditPassword from './client/pages/login/DashboardEditPassword';
import DashboardShowHotSales from './client/pages/dashboard/HotSales/DashBoardShowHotSales';
import DashboardEditHotSales from './client/pages/dashboard/HotSales/DashboardEditHotSales';
import DashboardDeleteHotSales from './client/pages/dashboard/HotSales/DashboardDeleteHotSales';
import DashboardHotsalesProfile from './client/pages/dashboard/HotSales/DashboardHotsalesprofile';
import DashboardEditHotesalesProfile from './client/pages/dashboard/HotSales/DashboardEditHotesalesProfile';
import DashboardAddStayToBuy from './client/pages/dashboard/StayToBuy/DashboardAddStayToBuy';
import DashBoardShowStayToBuy from './client/pages/dashboard/StayToBuy/DashBoardShowStayToBuy';
import ShowStayToButProfile from './client/pages/dashboard/StayToBuy/ShowStayToBuyProfile';
import DashBoardstayToBuy from './client/pages/dashboard/StayToBuy/DashBoardStayToBuyEdit';
import DashBoardStayToBuyDelete from './client/pages/dashboard/StayToBuy/DashBoardStayToBuyDelete';
import DashBoardEditStayToBuyProfile from './client/pages/dashboard/StayToBuy/DashBoardEditStayToBuyProfile';
import DashBoardAddStaytorent from './client/pages/dashboard/staytorent/DashBoardAddStayToRent';
import DashboardShowStaytorent from './client/pages/dashboard/staytorent/DashboardShowStaytorent';
import DashboardStaytorentProfile from './client/pages/dashboard/staytorent/DashboardShowStayroRentProfile';
import DashboardStaytoRentEdit from './client/pages/dashboard/staytorent/DashboardStaytoRentEdit';
import DashboardStaytorentEditProfile from './client/pages/dashboard/staytorent/DashboardStaytorentEditProfile';
import DashBoardStayTorentDelete from './client/pages/dashboard/staytorent/DashBoardStaytorentDelete';
import DashBoardAddLands from './client/pages/dashboard/Lands/DashboardAddLands';
import DashBoardShowLands from './client/pages/dashboard/Lands/DashBoardShowLands';
import ShowLandsProfile from './client/pages/dashboard/Lands/DashBoardLandProfile';
import DashBoardEditLands from './client/pages/dashboard/Lands/DashBoardEditLands';
import DashBoardDeleteLands from './client/pages/dashboard/Lands/DashBoardDeleteLands';
import DashBoardEditLandsProfile from './client/pages/dashboard/Lands/DashboardEditLandsProfile';
import DashBoardCreateAds from './client/pages/dashboard/Ads/DashBoardCreateAds';
import DashBoardShowAds from './client/pages/dashboard/Ads/DashBoardShowAds';
import DashBoardEditAds from './client/pages/dashboard/Ads/DashBoardEditAds';
import DashBoardDeleteAds from './client/pages/dashboard/Ads/DashBoardDeleteAds';
import SuperAdminApp from './superAdmin/App';
import AdminPortalApp from './admin/AdminPortalApp';

function App() {
  return (
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
        <Route element={<Home />} path="/" />
        <Route element={<Login />} path="/client-login" />
        <Route element={<Register />} path="/client-register" />

        {/* Super Admin (super_admin role only) */}
        <Route path="/admin/*" element={<SuperAdminApp />} />

        {/* Normal Admin Portal (admin role only) */}
        <Route path="/admin-portal/*" element={<AdminPortalApp />} />

        {/* hotsales */}
        <Route element={<DashnoardAddHotSales />} path="/dashboard/add-hotsales" />
        <Route element={< DashboardShowHotSales />} path="/dashboard/show-hotsales/:id" />
        <Route element={<DashboardEditHotSales />} path="/dashboard/edit-hotsales/:id" />
        <Route element={<DashboardHotsalesProfile />} path="/dashboard/hot-sales/profile/:id" />
        {/* profile */}
        <Route element={<DashBoardProfile />} path="/dashboard/profile/:id" />
        <Route element={<DashboardEditProfile />} path="/dashboard/edit-client/:id" />
        <Route element={<DashboardEditPassword />} path="/dashboard/change-password/:id" />
        <Route element={<DashboardDeleteHotSales />} path="/dashboard/delete-hotsales/:id" />
        <Route element={<DashboardEditHotesalesProfile />} path="/dashboard/edit-hotsales-profile/:id" />

        {/* stay to buy */}
        <Route element={<DashboardAddStayToBuy />} path="/dashboard/add-stay-to-buy/:id" />
        <Route element={<DashBoardShowStayToBuy />} path="/dashboard/stays-buy/view/:id" />
        <Route element={<ShowStayToButProfile />} path="/dashboard/stays-buy/profile/:id" />
        <Route element={<DashBoardstayToBuy />} path="/dashboard/stays-buy/edit/:id" />
        <Route element={<DashBoardEditStayToBuyProfile />} path="/dashboard/stays-buy/edit-profile/:id" />
        <Route element={<DashBoardStayToBuyDelete />} path="/dashboard/stays-buy/delete/:id" />

        {/* stay to rent */}
        <Route element={<DashBoardAddStaytorent />} path="/dashboard/stay-to-rent/:id" />
        <Route element={<DashboardShowStaytorent />} path="/dashboard/stays-rent/view/:id" />
        <Route element={<DashboardStaytorentProfile />} path="/dashboard/stays-rent/profile/:id" />
        <Route element={<DashboardStaytoRentEdit />} path="/dashboard/stays-rent/edit/:id" />
        <Route element={<DashboardStaytorentEditProfile />} path="/dashboard/stays-rent/edit-profile/:id" />
        <Route element={<DashBoardStayTorentDelete />} path="/dashboard/stays-rent/delete/:id" />


        {/* lands */}
        <Route element={<DashBoardAddLands />} path="/dashboard/add-lands/:id" />
        <Route element={<DashBoardShowLands />} path="/dashboard/lands/view/:id" />
        <Route element={<ShowLandsProfile />} path="/dashboard/lands/profile/:id" />
        <Route element={<DashBoardEditLands />} path="/dashboard/lands/edit/:id" />
        <Route element={<DashBoardDeleteLands />} path="/dashboard/lands/delete/:id" />
        <Route element={<DashBoardEditLandsProfile />} path="/dashboard/lands/edit-profile/:id" />


        {/* ads */}
        <Route element={<DashBoardCreateAds />} path="/dashboard/create-ads/:id" />
        <Route element={<DashBoardShowAds />} path="/dashboard/ads/view/:id" />
        <Route element={<DashBoardShowAds />} path="/dashboard/ads/edit/:id" />
        <Route element={<DashBoardDeleteAds />} path="/dashboard/ads/delete/:id" />
        {/* payment */}
        <Route element={<DashboardPayment />} path="/dashboard/payment" />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        <Route element={<DashboardHome />} path="/dashboard/:id" />
      </Routes>
    </div>
  )
}

export default App;
