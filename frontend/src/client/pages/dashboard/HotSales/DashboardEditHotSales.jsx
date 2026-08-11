import React from 'react'
import Dashboardnavbar from "../../../components/Dashboardnavbar";
import DashboardSidebar from "../../../components/DashboardSidebar";
import { Edit } from 'lucide-react';
import EditHotSales from '../../../components/EditHotSales';
import { useParams } from 'react-router-dom';

const DashboardEditHotSales = () =>{

  const {id} = useParams();
    return(
       <div className="w-full min-h-screen bg-gray-50">
      
            <Dashboardnavbar />
      
            <div className="flex mt-6">
      
             <aside className="hidden sm:block w-72 shrink-0 h-[calc(100vh-80px)]">
                       <DashboardSidebar clientID={id} />
                     </aside>
             
                    
                     <div className="sm:hidden">
                       <DashboardSidebar clientID={id} />
                     </div>
      
      
              {/* Content */}
              <main className="flex-1 overflow-x-hidden p-5">
              <EditHotSales clientID={id} />
              </main>
      
      
            </div>
      
          </div>
    )
}

export default DashboardEditHotSales