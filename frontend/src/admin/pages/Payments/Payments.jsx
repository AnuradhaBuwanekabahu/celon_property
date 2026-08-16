import React,{useEffect,useState} from "react";
import {Link} from "react-router-dom";
import {Eye, Pencil} from "lucide-react";
import {toast} from "react-toastify";

import {
    getPayments
} from "../../api/paymentApi";
import Loader from "../../components/Loader";



const Payments=()=>{


const [payments,setPayments]=useState([]);

const [loading,setLoading]=useState(true);



useEffect(()=>{

loadPayments();

},[]);



const loadPayments=async()=>{


try{


const res=await getPayments();


setPayments(
    res.data.payments
);


}
catch(error){

console.log(error);

toast.error(
"Failed loading payments"
);


}
finally{

setLoading(false);

}


};



  // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return <Loader />;

    }


return (
    <div className="min-h-screen bg-[#E8EEF9] p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">

            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] prata-regular">
                    Payments
                </h1>

                <p className="text-sm text-gray-500 mt-1 inter">
                    Manage all property payments
                </p>
            </div>

            <span className="text-gray-600 font-medium inter">
                Total:{" "}
                <span className="text-[#14213D] font-bold">
                    {payments.length}
                </span>
            </span>

        </div>


        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                    {/* Table Header */}
                    <thead className="bg-[#14213D] text-white">

                        <tr>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                ID
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Client
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Property
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Amount
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Method
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Status
                            </th>

                            <th className="px-5 py-4 text-center font-semibold inter">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    {/* Table Body */}
                    <tbody>

                        {payments.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="text-center py-12 text-gray-500 inter"
                                >
                                    No Payments Found
                                </td>

                            </tr>

                        ) : (

                            payments.map((payment) => (

                                <tr
                                    key={payment.id}
                                    className="border-t border-gray-100 hover:bg-[#E8EEF9] transition"
                                >

                                    {/* ID */}
                                    <td className="px-5 py-4">

                                        <span className="font-semibold text-[#14213D] inter">
                                            #{payment.id}
                                        </span>

                                    </td>


                                    {/* Client */}
                                    <td className="px-5 py-4">

                                        <div>

                                            <p className="font-semibold text-[#14213D] inter">
                                                {payment.full_name || "-"}
                                            </p>

                                            <p className="text-sm text-gray-500 inter">
                                                {payment.email || "-"}
                                            </p>

                                        </div>

                                    </td>


                                    {/* Property */}
                                    <td className="px-5 py-4">

                                        <span className="text-gray-700 inter">
                                            {payment.property_type || "-"}
                                        </span>

                                    </td>


                                    {/* Amount */}
                                    <td className="px-5 py-4">

                                        <span className="font-semibold text-[#14213D] inter">
                                            Rs.{" "}
                                            {Number(
                                                payment.amount || 0
                                            ).toLocaleString()}
                                        </span>

                                    </td>


                                    {/* Method */}
                                    <td className="px-5 py-4">

                                        <span className="text-gray-600 inter">
                                            {payment.payment_method || "-"}
                                        </span>

                                    </td>


                                    {/* Status */}
                                    <td className="px-5 py-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium inter ${
                                                payment.status === "paid"
                                                    ? "bg-green-100 text-green-700"
                                                    : payment.status === "pending"
                                                    ? "bg-[#FFF4D6] text-[#A16207]"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {payment.status || "unknown"}
                                        </span>

                                    </td>


                                    {/* Actions */}
                                    <td className="px-5 py-4">

                                        <div className="flex justify-center gap-3">

                                            {/* View */}
                                            <Link
                                                to={`/admin/payments/${payment.id}`}
                                                className="bg-[#14213D] text-white p-2 rounded-lg hover:bg-[#1c2c52] transition"
                                                title="View Payment"
                                            >
                                                <Eye size={18} />
                                            </Link>


                                            {/* Edit */}
                                            <Link
                                                to={`/admin/payments/edit/${payment.id}`}
                                                className="bg-[#FBBF24] text-[#14213D] p-2 rounded-lg hover:bg-[#d3a120] transition"
                                                title="Edit Payment"
                                            >
                                                <Pencil size={18} />
                                            </Link>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    </div>
);







}


export default Payments;