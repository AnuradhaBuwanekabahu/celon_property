import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./user/components/layout/Navbar";
import Footer from "./user/components/layout/Footer";
import {
  RequireAuth,
  RequireSuperAdmin,
} from "./superAdmin/components/RouteGuards";
import { propertyConfigs } from "./superAdmin/config/propertyConfigs";

const ClientLogin = lazy(() => import("./client/pages/login/ClientLogin"));
const Register = lazy(() => import("./client/pages/login/Register"));
const DashboardHome = lazy(() => import("./client/pages/dashboard/DashboardHome"));
const DashnoardAddHotSales = lazy(() => import("./client/pages/dashboard/HotSales/DashnoardAddHotSales"));
const DashboardPayment = lazy(() => import("./client/Routes/DashboardPayment"));
const PaymentSuccess = lazy(() => import("./client/components/PaymentSuccess"));
const DashBoardProfile = lazy(() => import("./client/pages/login/DashBoardProfile"));
const DashboardEditProfile = lazy(() => import("./client/pages/login/DashboardEditProfile"));
const DashboardEditPassword = lazy(() => import("./client/pages/login/DashboardEditPassword"));
const DashboardShowHotSales = lazy(() => import("./client/pages/dashboard/HotSales/DashBoardShowHotSales"));
const DashboardEditHotSales = lazy(() => import("./client/pages/dashboard/HotSales/DashboardEditHotSales"));
const DashboardDeleteHotSales = lazy(() => import("./client/pages/dashboard/HotSales/DashboardDeleteHotSales"));
const DashboardHotsalesProfile = lazy(() => import("./client/pages/dashboard/HotSales/DashboardHotsalesprofile"));
const DashboardEditHotesalesProfile = lazy(() => import("./client/pages/dashboard/HotSales/DashboardEditHotesalesProfile"));
const DashboardAddStayToBuy = lazy(() => import("./client/pages/dashboard/StayToBuy/DashboardAddStayToBuy"));
const DashBoardShowStayToBuy = lazy(() => import("./client/pages/dashboard/StayToBuy/DashBoardShowStayToBuy"));
const ShowStayToButProfile = lazy(() => import("./client/pages/dashboard/StayToBuy/ShowStayToBuyProfile"));
const DashBoardstayToBuy = lazy(() => import("./client/pages/dashboard/StayToBuy/DashBoardStayToBuyEdit"));
const DashBoardStayToBuyDelete = lazy(() => import("./client/pages/dashboard/StayToBuy/DashBoardStayToBuyDelete"));
const DashBoardEditStayToBuyProfile = lazy(() => import("./client/pages/dashboard/StayToBuy/DashBoardEditStayToBuyProfile"));
const DashBoardAddStaytorent = lazy(() => import("./client/pages/dashboard/staytorent/DashBoardAddStayToRent"));
const DashboardShowStaytorent = lazy(() => import("./client/pages/dashboard/staytorent/DashboardShowStaytorent"));
const DashboardStaytorentProfile = lazy(() => import("./client/pages/dashboard/staytorent/DashboardShowStayroRentProfile"));
const DashboardStaytoRentEdit = lazy(() => import("./client/pages/dashboard/staytorent/DashboardStaytoRentEdit"));
const DashboardStaytorentEditProfile = lazy(() => import("./client/pages/dashboard/staytorent/DashboardStaytorentEditProfile"));
const DashBoardStayTorentDelete = lazy(() => import("./client/pages/dashboard/staytorent/DashBoardStaytorentDelete"));
const DashBoardAddLands = lazy(() => import("./client/pages/dashboard/Lands/DashboardAddLands"));
const DashBoardShowLands = lazy(() => import("./client/pages/dashboard/Lands/DashBoardShowLands"));
const ShowLandsProfile = lazy(() => import("./client/pages/dashboard/Lands/DashBoardLandProfile"));
const DashBoardEditLands = lazy(() => import("./client/pages/dashboard/Lands/DashBoardEditLands"));
const DashBoardDeleteLands = lazy(() => import("./client/pages/dashboard/Lands/DashBoardDeleteLands"));
const DashBoardEditLandsProfile = lazy(() => import("./client/pages/dashboard/Lands/DashboardEditLandsProfile"));
const DashBoardCreateAds = lazy(() => import("./client/pages/dashboard/Ads/DashBoardCreateAds"));
const DashBoardShowAds = lazy(() => import("./client/pages/dashboard/Ads/DashBoardShowAds"));
const DashBoardEditAds = lazy(() => import("./client/pages/dashboard/Ads/DashBoardEditAds"));
const DashBoardDeleteAds = lazy(() => import("./client/pages/dashboard/Ads/DashBoardDeleteAds"));

const Listings = lazy(() => import("./user/pages/Listings"));
const PropertyDetails = lazy(() => import("./user/pages/PropertyDetails"));
const About = lazy(() => import("./user/pages/About"));
const Contact = lazy(() => import("./user/pages/Contact"));
const Home = lazy(() => import("./user/pages/Home"));
const Wanted = lazy(() => import("./user/pages/Wanted"));
const Services = lazy(() => import("./user/pages/Services"));
const UserLogin = lazy(() => import("./user/pages/UserLogin"));
const UserSignUp = lazy(() => import("./user/pages/UserSignUp"));
const HotSales = lazy(() => import("./user/pages/HotSales"));
const StayToRent = lazy(() => import("./user/pages/StayToRent"));
const StayToBuy = lazy(() => import("./user/pages/StayToBuy"));
const Lands = lazy(() => import("./user/pages/Lands"));
const RentalDetails = lazy(() => import("./user/pages/RentalDetails"));

const Login = lazy(() => import("./superAdmin/pages/Login"));
const Dashboard = lazy(() => import("./superAdmin/pages/Dashboard"));
const Clients = lazy(() => import("./superAdmin/pages/Clients"));
const Offers = lazy(() => import("./superAdmin/pages/Offers"));
const AdLimits = lazy(() => import("./superAdmin/pages/AdLimits"));
const Ads = lazy(() => import("./superAdmin/pages/Ads"));
const Payments = lazy(() => import("./superAdmin/pages/Payments"));
const Admins = lazy(() => import("./superAdmin/pages/Admins"));
const PropertyPage = lazy(() => import("./superAdmin/pages/properties/PropertyPage"));

const ProtectedRouted = lazy(() => import("./admin/routes/ProtectedRoute"));
const AdminRoutes = lazy(() => import("./admin/routes/AdminRoutes"));
const RegisterAdmin = lazy(() => import("./admin/pages/adminAuth/RegisterAdmin"));
const LoginAdmins = lazy(() => import("./admin/pages/adminAuth/LoginAdmin"));

const routeFallback = (
  <div style={{
    minHeight: "40vh",
    display: "grid",
    placeItems: "center",
    fontSize: "1rem",
    color: "#4b5563",
  }}>
    Loading page...
  </div>
);

function App() {
  const location = useLocation();

  const isDashboardRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/superadmin") ||
    location.pathname.startsWith("/admin");

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

      {isDashboardRoute ? null : <Navbar />}

      <Suspense fallback={routeFallback}>
        <Routes>
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
          <Route element={<DashboardHome />} path="/dashboard/:id" />

          <Route element={<DashnoardAddHotSales />} path="/dashboard/add-hotsales" />
          <Route element={<DashboardShowHotSales />} path="/dashboard/show-hotsales/:id" />
          <Route element={<DashboardEditHotSales />} path="/dashboard/edit-hotsales/:id" />
          <Route element={<DashboardHotsalesProfile />} path="/dashboard/hot-sales/profile/:id" />
          <Route element={<DashBoardProfile />} path="/dashboard/profile/:id" />
          <Route element={<DashboardEditProfile />} path="/dashboard/edit-client/:id" />
          <Route element={<DashboardEditPassword />} path="/dashboard/change-password/:id" />
          <Route element={<DashboardDeleteHotSales />} path="/dashboard/delete-hotsales/:id" />
          <Route element={<DashboardEditHotesalesProfile />} path="/dashboard/edit-hotsales-profile/:id" />

          <Route element={<DashboardAddStayToBuy />} path="/dashboard/add-stay-to-buy/:id" />
          <Route element={<DashBoardShowStayToBuy />} path="/dashboard/stays-buy/view/:id" />
          <Route element={<ShowStayToButProfile />} path="/dashboard/stays-buy/profile/:id" />
          <Route element={<DashBoardstayToBuy />} path="/dashboard/stays-buy/edit/:id" />
          <Route element={<DashBoardEditStayToBuyProfile />} path="/dashboard/stays-buy/edit-profile/:id" />
          <Route element={<DashBoardStayToBuyDelete />} path="/dashboard/stays-buy/delete/:id" />

          <Route element={<DashBoardAddStaytorent />} path="/dashboard/stay-to-rent/:id" />
          <Route element={<DashboardShowStaytorent />} path="/dashboard/stays-rent/view/:id" />
          <Route element={<DashboardStaytorentProfile />} path="/dashboard/stays-rent/profile/:id" />
          <Route element={<DashboardStaytoRentEdit />} path="/dashboard/stays-rent/edit/:id" />
          <Route element={<DashboardStaytorentEditProfile />} path="/dashboard/stays-rent/edit-profile/:id" />
          <Route element={<DashBoardStayTorentDelete />} path="/dashboard/stays-rent/delete/:id" />

          <Route element={<DashBoardAddLands />} path="/dashboard/add-lands/:id" />
          <Route element={<DashBoardShowLands />} path="/dashboard/lands/view/:id" />
          <Route element={<ShowLandsProfile />} path="/dashboard/lands/profile/:id" />
          <Route element={<DashBoardEditLands />} path="/dashboard/lands/edit/:id" />
          <Route element={<DashBoardDeleteLands />} path="/dashboard/lands/delete/:id" />
          <Route element={<DashBoardEditLandsProfile />} path="/dashboard/lands/edit-profile/:id" />

          <Route element={<DashBoardCreateAds />} path="/dashboard/create-ads/:id" />
          <Route element={<DashBoardShowAds />} path="/dashboard/ads/view/:id" />
          <Route element={<DashBoardShowAds />} path="/dashboard/ads/edit/:id" />
          <Route element={<DashBoardDeleteAds />} path="/dashboard/ads/delete/:id" />

          <Route element={<DashboardPayment />} path="/dashboard/payment" />
          <Route path="/payment-success" element={<PaymentSuccess />} />

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
          <Route
            path="/superadmin/properties/hot-sales"
            element={
              <RequireAuth>
                <PropertyPage config={propertyConfigs["hot-sales"]} />
              </RequireAuth>
            }
          />
          <Route
            path="/superadmin/properties/stays-to-buy"
            element={
              <RequireAuth>
                <PropertyPage config={propertyConfigs["stays-to-buy"]} />
              </RequireAuth>
            }
          />
          <Route
            path="/superadmin/properties/stays-to-rent"
            element={
              <RequireAuth>
                <PropertyPage config={propertyConfigs["stays-to-rent"]} />
              </RequireAuth>
            }
          />
          <Route
            path="/superadmin/properties/land"
            element={
              <RequireAuth>
                <PropertyPage config={propertyConfigs.land} />
              </RequireAuth>
            }
          />
          <Route
            path="/superadmin/properties/wanted"
            element={
              <RequireAuth>
                <PropertyPage config={propertyConfigs.wanted} />
              </RequireAuth>
            }
          />

          <Route path="/admin/login" element={<LoginAdmins />} />
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
      </Suspense>

      {isDashboardRoute ? null : <Footer />}
    </div>
  );
}

export default App;
