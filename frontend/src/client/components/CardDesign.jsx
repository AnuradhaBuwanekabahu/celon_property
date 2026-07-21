import React from "react";
import { FaStar } from "react-icons/fa6";

const CardDesign = ({title , main_image ,property_type , location ,price,rate,duration}) => {
  return (
    <div className="relative left-24  w-[300px] h-[350px] rounded-xl overflow-hidden shadow-md hover:shadow-xl">

      <img
        src={main_image}
        alt=""
        className="w-full h-full object-cover"
      />

      {/* Badge */}
      <div className="absolute top-3 left-3 bg-[#14213D] text-white px-4 py-1 rounded-full text-sm">
        {property_type}
      </div>

      {/* Info Card */}
      <div className="absolute bottom-4 left-4 w-[260px] bg-white rounded-2xl p-4">

        <p className="font-bold text-[15px]">
          {title}
        </p>

        <p className="text-[11px] text-gray-500 mt-1">
          {location}
        </p>

        <div className="flex items-center justify-between mt-3">
          <p className="font-bold text-[16px]">
            RS.{price}
            <span className="text-[11px] font-normal text-gray-500">
              {" "}
              /{duration}
            </span>
          </p>

          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <span className="text-sm font-medium">{rate}</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CardDesign;