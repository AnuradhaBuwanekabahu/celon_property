import React from "react";
import { FaStar } from "react-icons/fa6";
import { Clock } from "lucide-react";

const CardDesign = ({ title, main_image, property_type, location, price, rate, duration, remaining_days, status }) => {
  const isPending = status === "pending";
  const numericRemainingDays = remaining_days === null || remaining_days === undefined
    ? null
    : Number(remaining_days);
  const isExpired = status === "expired" || numericRemainingDays === 0;

  const badge = isPending
    ? { label: "Pending activation", className: "bg-slate-100 text-slate-600" }
    : isExpired
      ? { label: "Expired", className: "bg-red-50 text-red-600" }
      : numericRemainingDays > 0
        ? { label: `${numericRemainingDays} days left`, className: "bg-[#FCA311] text-[#14213D]" }
        : null;

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

        {badge && (
          <div className={`mt-3 inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-semibold ${badge.className}`}>
            <Clock size={14} aria-hidden="true" />
            <span>{badge.label}</span>
          </div>
        )}

      </div>

    </div>
  );
};

export default CardDesign;