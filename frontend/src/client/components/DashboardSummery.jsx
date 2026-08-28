import React, { useEffect, useContext, useState } from "react";
import { MdBedroomParent } from "react-icons/md";
import { LiaSalesforce } from "react-icons/lia";
import { FaHome } from "react-icons/fa";
import { MdOutlineLandslide } from "react-icons/md";
import { RiAdvertisementLine } from "react-icons/ri";
import { clientContext } from "../context/ClientContext";
import API from "../api/clientapi";

const DashboardSummery = ({ clientID }) => {
  const { hotSales, stayToBuy, stayToRent, lands, getHotSales, getStayToBuy, getStayToRent, getlands } = useContext(clientContext);
  const [ads, setAds] = useState([]);

  const resolvedClientId = clientID || localStorage.getItem("clientId") || "";

  useEffect(() => {
    if (!resolvedClientId) return;
    getHotSales();
    getStayToBuy();
    getStayToRent();
    getlands();

    const fetchAds = async () => {
      try {
        const response = await API.get("/api/ads/ads");
        const data = response.data?.ads || [];
        setAds(data.filter((item) => Number(item.client_id) === Number(resolvedClientId)));
      } catch (error) {
        console.error(error);
      }
    };

    fetchAds();
  }, [resolvedClientId]);

  const hotSalesCount = hotSales.filter((item) => Number(item.client_id) === Number(resolvedClientId)).length;
  const stayToBuyCount = stayToBuy.filter((item) => Number(item.client_id) === Number(resolvedClientId)).length;
  const stayToRentCount = stayToRent.filter((item) => Number(item.client_id) === Number(resolvedClientId)).length;
  const landsCount = lands.filter((item) => Number(item.client_id) === Number(resolvedClientId)).length;
  const adsCount = ads.length;

  const category = [
    {
      name: "Hot Sales",
      count: hotSalesCount,
      icon: <LiaSalesforce />,
      color: "bg-red-500",
    },
    {
      name: "Stay To Buy",
      count: stayToBuyCount,
      icon: <FaHome />,
      color: "bg-blue-500",
    },
    {
      name: "Stay To Rent",
      count: stayToRentCount,
      icon: <MdBedroomParent />,
      color: "bg-green-500",
    },
    {
      name: "Lands",
      count: landsCount,
      icon: <MdOutlineLandslide />,
      color: "bg-yellow-500",
    },
    {
      name: "Advertisements",
      count: adsCount,
      icon: <RiAdvertisementLine />,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="max-w-6xl mt-8 ml-24 mx-auto p-4 sm:p-4  bg-white">
      <div className="mb-4">
    
        <p className="text-m text-black mt-1">Overview of your property listings</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {category.map((item, index) => (
          <div
            key={index}
            className="bg-[#14213D] w-full rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-3 flex items-center justify-between"
          >
            <div>
              <h3 className="text-gray-300 text-sm">{item.name}</h3>
              <p className="text-2xl font-bold mt-2 text-white">{item.count}</p>
            </div>

            <div
              className={`${item.color} w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSummery;