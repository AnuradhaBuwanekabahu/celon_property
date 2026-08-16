<<<<<<< Updated upstream
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
function  App(){
  return(
    <div>

         <ToastContainer
=======
import React from "react";
import { Routes, Route } from "react-router-dom";
import ClientLogin from "./client/pages/login/ClientLogin";
import Register from "./client/pages/login/Register";
import DashboardHome from "./client/pages/dashboard/DashboardHome";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashnoardAddHotSales from "./client/pages/dashboard/HotSales/DashnoardAddHotSales";
import DashboardPayment from "./client/Routes/DashboardPayment";
import PaymentSuccess from "./client/components/PaymentSuccess";
import DashBoardProfile from "./client/pages/login/DashBoardProfile";
import DashboardEditProfile from "./client/pages/login/DashboardEditProfile";
import DashboardEditPassword from "./client/pages/login/DashboardEditPassword";
import DashboardShowHotSales from "./client/pages/dashboard/HotSales/DashBoardShowHotSales";
import DashboardEditHotSales from "./client/pages/dashboard/HotSales/DashboardEditHotSales";
import DashboardDeleteHotSales from "./client/pages/dashboard/HotSales/DashboardDeleteHotSales";
import DashboardHotsalesProfile from "./client/pages/dashboard/HotSales/DashboardHotsalesprofile";
import DashboardEditHotesalesProfile from "./client/pages/dashboard/HotSales/DashboardEditHotesalesProfile";
import DashboardAddStayToBuy from "./client/pages/dashboard/StayToBuy/DashboardAddStayToBuy";
import DashBoardShowStayToBuy from "./client/pages/dashboard/StayToBuy/DashBoardShowStayToBuy";
import ShowStayToButProfile from "./client/pages/dashboard/StayToBuy/ShowStayToBuyProfile";
import DashBoardstayToBuy from "./client/pages/dashboard/StayToBuy/DashBoardStayToBuyEdit";
import DashBoardStayToBuyDelete from "./client/pages/dashboard/StayToBuy/DashBoardStayToBuyDelete";
import DashBoardEditStayToBuyProfile from "./client/pages/dashboard/StayToBuy/DashBoardEditStayToBuyProfile";
import DashBoardAddStaytorent from "./client/pages/dashboard/staytorent/DashBoardAddStayToRent";
import DashboardShowStaytorent from "./client/pages/dashboard/staytorent/DashboardShowStaytorent";
import DashboardStaytorentProfile from "./client/pages/dashboard/staytorent/DashboardShowStayroRentProfile";
import DashboardStaytoRentEdit from "./client/pages/dashboard/staytorent/DashboardStaytoRentEdit";
import DashboardStaytorentEditProfile from "./client/pages/dashboard/staytorent/DashboardStaytorentEditProfile";
import DashBoardStayTorentDelete from "./client/pages/dashboard/staytorent/DashBoardStaytorentDelete";
import DashBoardAddLands from "./client/pages/dashboard/Lands/DashboardAddLands";
import DashBoardShowLands from "./client/pages/dashboard/Lands/DashBoardShowLands";
import ShowLandsProfile from "./client/pages/dashboard/Lands/DashBoardLandProfile";
import DashBoardEditLands from "./client/pages/dashboard/Lands/DashBoardEditLands";
import DashBoardDeleteLands from "./client/pages/dashboard/Lands/DashBoardDeleteLands";
import DashBoardEditLandsProfile from "./client/pages/dashboard/Lands/DashboardEditLandsProfile";
import DashBoardCreateAds from "./client/pages/dashboard/Ads/DashBoardCreateAds";
import DashBoardShowAds from "./client/pages/dashboard/Ads/DashBoardShowAds";
import DashBoardEditAds from "./client/pages/dashboard/Ads/DashBoardEditAds";
import DashBoardDeleteAds from "./client/pages/dashboard/Ads/DashBoardDeleteAds";
import Listings from "./user/pages/Listings";
import PropertyDetails from "./user/pages/PropertyDetails";
import About from "./user/pages/About";
import Contact from "./user/pages/Contact";
import Home from "./user/pages/Home";
import Wanted from "./user/pages/Wanted";
import Services from "./user/pages/Services";
import UserLogin from "./user/pages/UserLogin";
import UserSignUp from "./user/pages/UserSignUp";
import Navbar from "./user/components/layout/Navbar";
import Footer from "./user/components/layout/Footer";
import HotSales from "./user/pages/HotSales";
import StayToRent from "./user/pages/StayToRent";
import StayToBuy from "./user/pages/StayToBuy";
import Lands from "./user/pages/Lands";
import RentalDetails from "./user/pages/RentalDetails";
import Login from "./superAdmin/pages/Login";
import RegisterAdmin from "./admin/pages/adminAuth/RegisterAdmin";
import Dashboard from "./superAdmin/pages/Dashboard";
import Clients from "./superAdmin/pages/Clients";
import Offers from "./superAdmin/pages/Offers";
import AdLimits from "./superAdmin/pages/AdLimits";
import Ads from "./superAdmin/pages/Ads";
import Payments from "./superAdmin/pages/Payments";
import Admins from "./superAdmin/pages/Admins";
import { useLocation } from "react-router-dom";
import LoginAdmin from "./superAdmin/pages/Login";
import RegisterAdmin from "./admin/pages/adminAuth/RegisterAdmin";

import {
  RequireAuth,
  RequireSuperAdmin,
} from "./superAdmin/components/RouteGuards";
function App() {
  const location = useLocation();

  const isDashboardRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/superadmin");
  return (
    <div>
      <ToastContainer
>>>>>>> Stashed changes
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggables
      />
<<<<<<< Updated upstream
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
         </Routes>
=======

      {isDashboardRoute ? null : <Navbar />}
      <Routes>
        {/* user */}
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/rental/:id" element={<RentalDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/hot-sales" element={<HotSales />} />
        <Route path="/stay-to-rent" element={<StayToRent />} />
        <Route path="/stay-to-buy" element={<StayToBuy />} />
        <Route path="/lands" element={<Lands />} />
        <Route path="/wanted" element={<Wanted />} />
        <Route path="/services" element={<Services />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-signup" element={<UserSignUp />} />

        <Route element={<ClientLogin />} path="/dashboard/client-login" />
        <Route element={<Register />} path="/dashboard/client-register" />

        {/* hotsales */}
        <Route
          element={<DashnoardAddHotSales />}
          path="/dashboard/add-hotsales"
        />
        <Route
          element={<DashboardShowHotSales />}
          path="/dashboard/show-hotsales/:id"
        />
        <Route
          element={<DashboardEditHotSales />}
          path="/dashboard/edit-hotsales/:id"
        />
        <Route
          element={<DashboardHotsalesProfile />}
          path="/dashboard/hot-sales/profile/:id"
        />
        {/* profile */}
        <Route element={<DashBoardProfile />} path="/dashboard/profile/:id" />
        <Route
          element={<DashboardEditProfile />}
          path="/dashboard/edit-client/:id"
        />
        <Route
          element={<DashboardEditPassword />}
          path="/dashboard/change-password/:id"
        />
        <Route
          element={<DashboardDeleteHotSales />}
          path="/dashboard/delete-hotsales/:id"
        />
        <Route
          element={<DashboardEditHotesalesProfile />}
          path="/dashboard/edit-hotsales-profile/:id"
        />

        {/* stay to buy */}
        <Route
          element={<DashboardAddStayToBuy />}
          path="/dashboard/add-stay-to-buy/:id"
        />
        <Route
          element={<DashBoardShowStayToBuy />}
          path="/dashboard/stays-buy/view/:id"
        />
        <Route
          element={<ShowStayToButProfile />}
          path="/dashboard/stays-buy/profile/:id"
        />
        <Route
          element={<DashBoardstayToBuy />}
          path="/dashboard/stays-buy/edit/:id"
        />
        <Route
          element={<DashBoardEditStayToBuyProfile />}
          path="/dashboard/stays-buy/edit-profile/:id"
        />
        <Route
          element={<DashBoardStayToBuyDelete />}
          path="/dashboard/stays-buy/delete/:id"
        />

        {/* stay to rent */}
        <Route
          element={<DashBoardAddStaytorent />}
          path="/dashboard/stay-to-rent/:id"
        />
        <Route
          element={<DashboardShowStaytorent />}
          path="/dashboard/stays-rent/view/:id"
        />
        <Route
          element={<DashboardStaytorentProfile />}
          path="/dashboard/stays-rent/profile/:id"
        />
        <Route
          element={<DashboardStaytoRentEdit />}
          path="/dashboard/stays-rent/edit/:id"
        />
        <Route
          element={<DashboardStaytorentEditProfile />}
          path="/dashboard/stays-rent/edit-profile/:id"
        />
        <Route
          element={<DashBoardStayTorentDelete />}
          path="/dashboard/stays-rent/delete/:id"
        />

        {/* lands */}
        <Route
          element={<DashBoardAddLands />}
          path="/dashboard/add-lands/:id"
        />
        <Route
          element={<DashBoardShowLands />}
          path="/dashboard/lands/view/:id"
        />
        <Route
          element={<ShowLandsProfile />}
          path="/dashboard/lands/profile/:id"
        />
        <Route
          element={<DashBoardEditLands />}
          path="/dashboard/lands/edit/:id"
        />
        <Route
          element={<DashBoardDeleteLands />}
          path="/dashboard/lands/delete/:id"
        />
        <Route
          element={<DashBoardEditLandsProfile />}
          path="/dashboard/lands/edit-profile/:id"
        />

        {/* ads */}
        <Route
          element={<DashBoardCreateAds />}
          path="/dashboard/create-ads/:id"
        />
        <Route element={<DashBoardShowAds />} path="/dashboard/ads/view/:id" />
        <Route element={<DashBoardShowAds />} path="/dashboard/ads/edit/:id" />
        <Route
          element={<DashBoardDeleteAds />}
          path="/dashboard/ads/delete/:id"
        />

        {/* payment */}
        <Route element={<DashboardPayment />} path="/dashboard/payment" />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        <Route element={<DashboardHome />} path="/dashboard/:id" />

        <Route path="/superadmin/login" element={<Login />} />
        <Route path="/superadmin/register" element={<RegisterAdmin />} />
        <Route
          path="/superadmin/"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/superadmin/clients"
          element={
            <RequireAuth>
              <Clients />
            </RequireAuth>
          }
        />
        <Route
          path="/superadmin/payments"
          element={
            <RequireAuth>
              <Payments />
            </RequireAuth>
          }
        />
        <Route
          path="/superadmin/ads"
          element={
            <RequireAuth>
              <Ads />
            </RequireAuth>
          }
        />
        <Route
          path="/superadmin/admins"
          element={
            <RequireSuperAdmin>
              <Admins />
            </RequireSuperAdmin>
          }
        />
        <Route
          path="/superadmin/offers"
          element={
            <RequireSuperAdmin>
              <Offers />
            </RequireSuperAdmin>
          }
        />
        <Route
          path="/superadmin/ad-limits"
          element={
            <RequireSuperAdmin>
              <AdLimits />
            </RequireSuperAdmin>
          }
        />

        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/register" element={<RegisterAdmin />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRouted>
              <AdminRoutes />
            </ProtectedRouted>
          }
        />
      </Routes>
      {isDashboardRoute ? null : <Footer />}
>>>>>>> Stashed changes
    </div>
  );
}

export default App;
