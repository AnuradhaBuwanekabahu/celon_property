
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Dashboardnavbar from "../../components/Dashboardnavbar";
import DashboardSidebar from "../../components/DashboardSidebar";
import ChangePassword from "../../components/ChangePassword";



const DashboardEditPassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("clientToken")) {
      navigate("/client-login");
    }
  }, [navigate]);

  return (
    <div className="w-full min-h-screen bg-gray-50">

      <Dashboardnavbar />

      <div className="flex mt-6">

       <aside className="hidden sm:block w-72 shrink-0 h-[calc(100vh-80px)]">
                 <DashboardSidebar clientID={id} />
               </aside>
       
               {/* Mobile-only mount so the fixed top bar + drawer still render */}
               <div className="sm:hidden">
                 <DashboardSidebar clientID={id}/>
               </div>


        {/* Content */}
        <main className="flex-1 overflow-x-hidden p-5">
          <ChangePassword clientID={id} />
        </main>


      </div>

    </div>
  );
};

export default DashboardEditPassword;