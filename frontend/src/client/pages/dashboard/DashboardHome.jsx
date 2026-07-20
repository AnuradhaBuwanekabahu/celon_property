import React from 'react'
import Dashboardnavbar from '../../components/Dashboardnavbar';
import DashboardSidebar from '../../components/DashboardSidebar';
import DashboardSummery from '../../components/DashboardSummery';
import CardDesign from '../../components/CardDesign';

const DashboardHome = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">

      <Dashboardnavbar />

      <div className="flex mt-6">

        {/* Sidebar */}
        <aside className="w-64 shrink-0 h-[calc(100vh-80px)]">
          <DashboardSidebar />
        </aside>


        {/* Content */}
        <main className="flex-1 overflow-x-hidden">
          <DashboardSummery />
          <CardDesign/>
        </main>

      </div>

    </div>
  );
};

export default DashboardHome;