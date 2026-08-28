
import { Outlet } from "react-router-dom";
import AdminNavbar from "./Navbar";
import Sidebar from "./Sidebar";



const Layout = () => {
  return (
    <div className="flex flex-col h-screen">

      <AdminNavbar />

      <div className="flex flex-1 overflow-hidden">

        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default Layout;