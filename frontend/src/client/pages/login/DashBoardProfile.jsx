
import React from "react";
import Dashboardnavbar from "../../components/Dashboardnavbar";
import DashboardSidebar from "../../components/DashboardSidebar";
import ShowClientDetails from "../../components/ShowClientDetails";


const DashBoardProfile= () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">

      <Dashboardnavbar />

      <div className="flex mt-6">

       <aside className="hidden sm:block w-72 shrink-0 h-[calc(100vh-80px)]">
                 <DashboardSidebar />
               </aside>
       
               {/* Mobile-only mount so the fixed top bar + drawer still render */}
               <div className="sm:hidden">
                 <DashboardSidebar />
               </div>


        {/* Content */}
        <main className="flex-1 overflow-x-hidden p-5">
         <ShowClientDetails/>
        </main>


      </div>

    </div>
  );
};

export default DashBoardProfile;