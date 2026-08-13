import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";

import { getHotSales } from "../../api/hotSalesApi";
import Loader from "../../components/Loader";



const HotSales = () => {


  const [hotSales, setHotSales] = useState([]);

  const [loading, setLoading] = useState(true);




  const fetchHotSales = async () => {


    try {


      const res = await getHotSales();


      setHotSales(
        res.data.hotSales || []
      );


    } catch(error) {


      console.log(error);


    } finally {


      setLoading(false);


    }


  };





  useEffect(()=>{


    fetchHotSales();


  },[]);






  if(loading){

    return < Loader/>;

  }

return (
    <div className="min-h-screen bg-[#E8EEF9] p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">

            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] prata-regular">
                    Hot Sales
                </h1>

                <p className="text-sm text-gray-500 mt-1 inter">
                    Manage all hot sale properties
                </p>
            </div>

            <span className="text-gray-600 font-medium inter">
                Total:{" "}
                <span className="text-[#14213D] font-bold">
                    {hotSales.length}
                </span>
            </span>

        </div>


        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="overflow-x-auto">

                <table className="w-full min-w-[800px]">

                    <thead className="bg-[#14213D] text-white">

                        <tr>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Image
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Title
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Price
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                City
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Status
                            </th>

                            <th className="px-5 py-4 text-center font-semibold inter">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {hotSales.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="text-center py-12 text-gray-500 inter"
                                >
                                    No Hot Sales Found
                                </td>

                            </tr>

                        ) : (

                            hotSales.map((sale) => (

                                <tr
                                    key={sale.id}
                                    className="border-t border-gray-100 hover:bg-[#E8EEF9] transition"
                                >

                                    {/* Image */}
                                    <td className="px-5 py-4">

                                        <img
                                            src={`http://localhost:5000${sale.main_image}`}
                                            alt={sale.title}
                                            className="w-24 h-16 rounded-xl object-cover border border-gray-200"
                                        />

                                    </td>


                                    {/* Title */}
                                    <td className="px-5 py-4">

                                        <p className="font-semibold text-[#14213D] inter">
                                            {sale.title}
                                        </p>

                                    </td>


                                    {/* Price */}
                                    <td className="px-5 py-4">

                                        <span className="font-semibold text-[#14213D] inter">
                                            Rs.{" "}
                                            {Number(
                                                sale.price
                                            ).toLocaleString()}
                                        </span>

                                    </td>


                                    {/* City */}
                                    <td className="px-5 py-4 text-gray-600 inter">
                                        {sale.city}
                                    </td>


                                    {/* Status */}
                                    <td className="px-5 py-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium inter ${
                                                sale.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : sale.status === "sold"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-[#FFF4D6] text-[#A16207]"
                                            }`}
                                        >
                                            {sale.status}
                                        </span>

                                    </td>


                                    {/* Actions */}
                                    <td className="px-5 py-4">

                                        <div className="flex justify-center gap-3">

                                            {/* View */}
                                            <Link
                                                to={`/admin-portal/hot-sales/${sale.id}`}
                                                className="bg-[#14213D] text-white p-2 rounded-lg hover:bg-[#1c2c52] transition"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </Link>


                                            {/* Edit */}
                                            <Link
                                                to={`/admin-portal/hot-sales/edit/${sale.id}`}
                                                className="bg-[#FBBF24] text-[#14213D] p-2 rounded-lg hover:bg-[#d3a120] transition"
                                                title="Edit"
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


};


export default HotSales;