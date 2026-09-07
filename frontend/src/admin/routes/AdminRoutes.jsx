import { Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";

import Dashboard from "../pages/Dashboard/Dashboard";
import HotSales from "../pages/HotSales/HotSales";
import ViewHotSale from "../pages/HotSales/ViewHotSale";
import EditHotSale from "../pages/HotSales/EditHotSales";
import StayToBuy from "../pages/StayToBuy/StayToBuy";
import ViewStayToBuy from "../pages/StayToBuy/ViewStayToBuy";
import EditStayToBuy from "../pages/StayToBuy/EditStayToBuy";
import StayToRent from "../pages/StayToRent/StayToRent";
import ViewStayToRent from "../pages/StayToRent/ViewStayToRent";
import EditStayToRent from "../pages/StayToRent/EditStayToRent";
import Lands from "../pages/lands/Lands";
import ViewLand from "../pages/lands/ViewLand";
import EditLand from "../pages/lands/EditLand";
import Ads from "../pages/Advertisements/Ads";
import ViewAd from "../pages/Advertisements/ViewAd";
import EditAd from "../pages/Advertisements/EditAd";
import Clients from "../pages/clients/Clients";
import ViewClient from "../pages/clients/ViewClient";
import EditClient from "../pages/clients/EditClient";
import Payments from "../pages/Payments/Payments";
import ViewPayment from "../pages/Payments/ViewPayments";
import EditPayment from "../pages/Payments/EditPayment";
import Wanted from "../pages/wanted/Wanted";
import ViewWanted from "../pages/wanted/ViewWanted";
import EditWanted from "../pages/wanted/EditWanted";
import ViewProfile from "../pages/Admin/ViewProfile";
import EditProfile from "../pages/Admin/EditProfile";



const AdminRoutes = () => {
  return (
    <Routes>
      
      <Route  path="/" element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />

 

        <Route path="/hot-sales" element={<HotSales />} />

        <Route path="/hot-sales/:id" element={<ViewHotSale />} />

        <Route path="/hot-sales/edit/:id" element={<EditHotSale />} />

        <Route
    path="stay-to-buy"
    element={<StayToBuy />}
/>

<Route
    path="stay-to-buy/:id"
    element={<ViewStayToBuy />}
/>

<Route
    path="stay-to-buy/edit/:id"
    element={<EditStayToBuy />}
/>


<Route
    path="stay-to-rent"
    element={<StayToRent />}
    />

<Route
    path="stay-to-rent/:id"
    element={<ViewStayToRent/>}
/>

<Route
    path="stay-to-rent/edit/:id"
    element={<EditStayToRent />}

/>


<Route path="lands" element={<Lands />} />

<Route path="lands/:id" element={<ViewLand />} />

<Route path="lands/edit/:id" element={<EditLand />} />


<Route
    path="advertisements"
    element={<Ads />}

/>
<Route
    path="advertisements/:id"
    element={<ViewAd />}

/>
<Route
    path="advertisements/edit/:id"
    element={<EditAd />}/>




<Route
path="clients"
element={<Clients />}

/>
<Route
path="clients/:id"
element={<ViewClient />}

/>
<Route
    path="clients/edit/:id"
    element={<EditClient />}

     />


<Route
 path="payments"
 element={<Payments />}

/>


<Route
 path="payments/:id"
 element={<ViewPayment />}

/>
<Route
    path="payments/edit/:id"
    element={<EditPayment />}

/>


<Route path="wanted" element={<Wanted/>} />


<Route path="wanted/:id" element={<ViewWanted />} />


<Route path="wanted/edit/:id" element={<EditWanted />} />

<Route
    path="/profile"
    element={<ViewProfile />}
/>

<Route
    path="/profile/edit"
    element={<EditProfile />}
/>

      </Route>
    </Routes>
  );
};

export default AdminRoutes;