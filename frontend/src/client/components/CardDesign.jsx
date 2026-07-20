import React from "react";
import { FaStar } from "react-icons/fa6";

const CardDesign = () => {
  return (
    <div className="relative left-24  w-[300px] h-[350px] rounded-xl overflow-hidden shadow-md hover:shadow-xl">

      <img
        src="https://www.maramani.com/cdn/shop/files/37RoomHotelDesign-ID49903-Image01.jpg?crop=center&height=1200&v=1705036055&width=1200"
        alt=""
        className="w-full h-full object-cover"
      />

      {/* Badge */}
      <div className="absolute top-3 left-3 bg-[#14213D] text-white px-4 py-1 rounded-full text-sm">
        Apartment
      </div>

      {/* Info Card */}
      <div className="absolute bottom-4 left-4 w-[260px] bg-white rounded-2xl p-4">

        <p className="font-bold text-[15px]">
          Ocean Pearl Apartment
        </p>

        <p className="text-[11px] text-gray-500 mt-1">
          No.140/4 Kandy Road, Matale
        </p>

        <div className="flex items-center justify-between mt-3">
          <p className="font-bold text-[16px]">
            Rs. 5000
            <span className="text-[11px] font-normal text-gray-500">
              {" "}
              /month
            </span>
          </p>

          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CardDesign;