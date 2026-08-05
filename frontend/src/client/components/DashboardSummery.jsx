import React from "react";
import { MdBedroomParent } from "react-icons/md";
import { LiaSalesforce } from "react-icons/lia";
import { FaHome } from "react-icons/fa";
import { MdOutlineLandslide } from "react-icons/md";
import { RiAdvertisementLine } from "react-icons/ri";

const DashboardSummery = () => {
  const category = [
    {
      name: "Hot Sales",
      count: 4,
      icon: <LiaSalesforce />,
      color: "bg-red-500",
    },
    {
      name: "Stay To Buy",
      count: 4,
      icon: <FaHome />,
      color: "bg-blue-500",
    },
    {
      name: "Stay To Rent",
      count: 4,
      icon: <MdBedroomParent />,
      color: "bg-green-500",
    },
    {
      name: "Lands",
      count: 4,
      icon: <MdOutlineLandslide />,
      color: "bg-yellow-500",
    },
    {
      name: "Advertisements",
      count: 4,
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