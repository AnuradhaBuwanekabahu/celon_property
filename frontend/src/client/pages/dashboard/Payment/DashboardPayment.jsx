import React from "react";
import Dashboardnavbar from "../../../components/Dashboardnavbar";
import DashboardSidebar from "../../../components/DashboardSidebar";
import PaymentPage from "../../../components/PaymentPage";


const DashboardPayment = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">

      <Dashboardnavbar />

      <div className="flex mt-6">

        {/* Sidebar */}
        <aside className="w-72 shrink-0 h-[calc(100vh-80px)]">
          <DashboardSidebar />
        </aside>


        {/* Content */}
        <main className="flex-1 overflow-x-hidden p-5">
             <PaymentPage/>
        </main>


      </div>

    </div>
  );
};

export default DashboardPayment;