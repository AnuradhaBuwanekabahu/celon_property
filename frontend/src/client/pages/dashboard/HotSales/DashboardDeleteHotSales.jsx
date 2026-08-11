import React from 'react'
import Dashboardnavbar from "../../../components/Dashboardnavbar";
import DashboardSidebar from "../../../components/DashboardSidebar";
import { Edit } from 'lucide-react';
import DeleteHotSales from '../../../components/DeleteHotSales';
import { useParams } from 'react-router-dom';

const DashboardDeleteHotSales = () => {

  const { id } = useParams();

  return (
    <div className="w-full min-h-screen bg-gray-50">

      <Dashboardnavbar />

      <div className="flex sm:mt-6">

       
        <aside className="hidden sm:block w-72 shrink-0 h-[calc(100vh-80px)]">
          <DashboardSidebar  clientID={id}/>
        </aside>

        {/* Mobile-only mount so the fixed top bar + drawer still render */}
        <div className="sm:hidden">
          <DashboardSidebar clientID={id} />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden p-5 pt-20 sm:pt-5">
          <DeleteHotSales clientID={id} />
        </main>

      </div>

    </div>
  )
}

export default DashboardDeleteHotSales