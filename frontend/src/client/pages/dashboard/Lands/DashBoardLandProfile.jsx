import React from 'react'
import Dashboardnavbar from "../../../components/Dashboardnavbar";
import DashboardSidebar from "../../../components/DashboardSidebar";
import HotsalesProfile from '../../../components/HotsalesProfile';
import { useParams } from 'react-router-dom';
import ShowLandsProfile from '../../../components/ShowLandsProfile';
const ShowStayToButProfile = () => {

 const { id } = useParams();
console.log('id from params:', id);

    return(
   <div className="w-full min-h-screen bg-gray-50">
      
            <Dashboardnavbar />
      
            <div className="flex mt-6">
      
<aside className="hidden sm:block w-72 shrink-0 h-[calc(100vh-80px)]">
          <DashboardSidebar  />
        </aside>

       
        <div className="sm:hidden">
          <DashboardSidebar  />
        </div>
      
              {/* Content */}
              <main className="flex-1 overflow-x-hidden p-5">
              <ShowLandsProfile landsID={id} />
              </main>
      </div>
      </div>

    )}
export default ShowLandsProfile;