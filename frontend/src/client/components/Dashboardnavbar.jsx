import React, { useState } from "react";
import { IoIosNotifications } from "react-icons/io";

export default function Dashboardnavbar() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full z-50 text-sm text-white  border-y-2 border-white">

      {/* Offer Banner */}
      <div className="text-center font-medium py-2 bg-black text-white ">
        <p>
          Exclusive Price Drop! Hurry,{" "}
          <span className="underline underline-offset-2">
            Offer Ends Soon!
          </span>
        </p>
      </div>

</div>
  );
}