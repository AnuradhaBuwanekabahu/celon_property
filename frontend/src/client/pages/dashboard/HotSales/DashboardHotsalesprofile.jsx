import React from 'react'
import Dashboardnavbar from "../../../components/Dashboardnavbar";
import DashboardSidebar from "../../../components/DashboardSidebar";
import HotsalesProfile from '../../../components/HotsalesProfile';
import { useParams, useLocation } from 'react-router-dom';
const DashboardHotsalesprofile = () => {
  const { id } = useParams();
  const location = useLocation();
  const clientID = location.state?.clientID ?? localStorage.getItem('clientId') ?? null;

    return(
   <div className="w-full min-h-screen bg-gray-50">
      
            <Dashboardnavbar />
      
            <div className="flex mt-6">
      
        <aside className="hidden sm:block w-72 shrink-0 h-[calc(100vh-80px)]">
          <DashboardSidebar clientID={clientID} />
        </aside>

        <div className="sm:hidden">
          <DashboardSidebar clientID={clientID} />
        </div>
      
              {/* Content */}
              <main className="flex-1 overflow-x-hidden p-5">
              <HotsalesProfile hotsaleID={id} />
              </main>
      </div>
      </div>

    )}
export default DashboardHotsalesprofile;