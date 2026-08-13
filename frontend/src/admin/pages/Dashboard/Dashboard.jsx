
import React, { useEffect, useState } from "react";
import {
    Home,
    Building2,
    Users,
    Megaphone,
    Map,
    CheckCircle,
    Clock,
    ShoppingBag
} from "lucide-react";
import { toast } from "react-toastify";

import { getDashboard } from "../../api/dashboardApi";
import Loader from "../../components/Loader";




const Dashboard = () => {

    const [dashboard, setDashboard] = useState({});
    const [loading, setLoading] = useState(true);


    // =====================================================
    // FETCH DASHBOARD
    // =====================================================

    const fetchDashboard = async () => {

        try {

            const res = await getDashboard();

            setDashboard(
                res.data?.data || {}
            );

        } catch (error) {

            console.log(
                "DASHBOARD ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchDashboard();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return <Loader />;

    }


    // =====================================================
    // STAT CARD
    // =====================================================

    const StatCard = ({
        title,
        value,
        icon: Icon,
        bg,
        color
    }) => (

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold text-[#14213D] mt-2">
                        {Number(value || 0).toLocaleString()}
                    </h2>

                </div>


                <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}
                >

                    <Icon
                        size={24}
                        className={color}
                    />

                </div>

            </div>

        </div>

    );


    // =====================================================
    // TOTAL PROPERTIES
    // =====================================================

    const totalProperties =
        Number(dashboard.hotSales || 0) +
        Number(dashboard.stayBuy || 0) +
        Number(dashboard.stayRent || 0) +
        Number(dashboard.lands || 0);


    return (
    <div className="min-h-screen bg-[#E8EEF9] p-4 sm:p-6 lg:p-8">

        {/* HEADER */}
        <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] prata-regular">
                Dashboard
            </h1>

            <p className="text-gray-500 mt-1 inter">
                Welcome to Ceylon Property Admin Panel
            </p>
        </div>


        {/* PROPERTY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

            <StatCard
                title="Hot Sales"
                value={dashboard.hotSales}
                icon={Home}
                bg="bg-[#FFF4D6]"
                color="text-[#14213D]"
            />

            <StatCard
                title="Stay To Buy"
                value={dashboard.stayBuy}
                icon={Building2}
                bg="bg-[#E8EEF9]"
                color="text-[#14213D]"
            />

            <StatCard
                title="Stay To Rent"
                value={dashboard.stayRent}
                icon={Building2}
                bg="bg-[#FFF4D6]"
                color="text-[#14213D]"
            />

            <StatCard
                title="Land"
                value={dashboard.lands}
                icon={Map}
                bg="bg-[#E8EEF9]"
                color="text-[#14213D]"
            />

        </div>


        {/* CLIENTS / ADS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">

            <StatCard
                title="Clients"
                value={dashboard.clients}
                icon={Users}
                bg="bg-[#E8EEF9]"
                color="text-[#14213D]"
            />

            <StatCard
                title="Advertisements"
                value={dashboard.ads}
                icon={Megaphone}
                bg="bg-[#FFF4D6]"
                color="text-[#14213D]"
            />

        </div>


        {/* PROPERTY STATUS */}
        <h2 className="text-xl font-bold text-[#14213D] mb-4 prata-regular">
            Property Status
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

            {/* ACTIVE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

                <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-xl bg-[#E8EEF9] flex items-center justify-center">
                        <CheckCircle
                            size={24}
                            className="text-[#14213D]"
                        />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 inter">
                            Active Properties
                        </p>

                        <h3 className="text-2xl font-bold text-[#14213D]">
                            {Number(
                                dashboard.activeProperties || 0
                            ).toLocaleString()}
                        </h3>
                    </div>

                </div>

            </div>


            {/* PENDING */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

                <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-xl bg-[#FFF4D6] flex items-center justify-center">
                        <Clock
                            size={24}
                            className="text-[#FBBF24]"
                        />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 inter">
                            Pending Properties
                        </p>

                        <h3 className="text-2xl font-bold text-[#FBBF24]">
                            {Number(
                                dashboard.pendingProperties || 0
                            ).toLocaleString()}
                        </h3>
                    </div>

                </div>

            </div>


            {/* SOLD */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

                <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-xl bg-[#E8EEF9] flex items-center justify-center">
                        <ShoppingBag
                            size={24}
                            className="text-[#14213D]"
                        />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 inter">
                            Sold Properties
                        </p>

                        <h3 className="text-2xl font-bold text-[#14213D]">
                            {Number(
                                dashboard.soldProperties || 0
                            ).toLocaleString()}
                        </h3>
                    </div>

                </div>

            </div>

        </div>


        {/* SUMMARY */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <h2 className="text-xl font-bold text-[#14213D] mb-5 prata-regular">
                Property Summary
            </h2>

            <div className="space-y-4">

                <div className="flex justify-between border-b pb-3">

                    <span className="text-gray-600 inter">
                        Total Properties
                    </span>

                    <span className="font-bold text-[#14213D]">
                        {Number(totalProperties || 0).toLocaleString()}
                    </span>

                </div>


                <div className="flex justify-between border-b pb-3">

                    <span className="text-gray-600 inter">
                        Total Clients
                    </span>

                    <span className="font-bold text-[#14213D]">
                        {Number(
                            dashboard.clients || 0
                        ).toLocaleString()}
                    </span>

                </div>


                <div className="flex justify-between">

                    <span className="text-gray-600 inter">
                        Total Advertisements
                    </span>

                    <span className="font-bold text-[#14213D]">
                        {Number(
                            dashboard.ads || 0
                        ).toLocaleString()}
                    </span>

                </div>

            </div>

        </div>

    </div>
);
};


export default Dashboard;

