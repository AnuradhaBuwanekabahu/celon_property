import React, { useState } from "react";
import { IoIosNotifications } from "react-icons/io";

export default function Dashboardnavbar() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="text-sm text-white w-full">

      {/* Offer Banner */}
      <div className="text-center font-medium py-2 bg-black text-white ">
        <p>
          Exclusive Price Drop! Hurry,{" "}
          <span className="underline underline-offset-2">
            Offer Ends Soon!
          </span>
        </p>
      </div>


      {/* Navbar */}
      <nav className="relative h-[70px] flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 bg-[#14213D] text-gray-900 transition-all shadow">

        {/* Logo */}
        <h1 className="text-xl text-white parata-regular">Ceylone property</h1>
        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-8 md:pl-28 text-white ">
          <li>
            <a href="#">Hot sales</a>
          </li>
          <li>
            <a href="#">Stays To Buy</a>
          </li>
          <li>
            <a href="#">Stays To Rent </a>
          </li>
          <li>
            <a href="#">Lands</a>
          </li>
          <li>
            <a href="#">Advertiesment</a>
          </li>
        </ul>

<div className=" flex gap-16 items-center ">
        {/* notification */}

       <IoIosNotifications className="size-9 text-white"/>

       {/* login */}
 <div className="flex flex-wrap justify-center gap-12">
            <div className="relative">
                <img className="size-12 rounded-full"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
                    alt="userImage1" />
                <div className="absolute bottom-2 right-0 size-3.5 rounded-full bg-green-500"></div>
            </div>
          
           
        </div>
</div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpenMenu(!openMenu)}
          aria-label="menu-btn"
          className="md:hidden active:scale-90 transition"
        >

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 30 30"
          >
            <path
              d="M3 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2z"
            />
          </svg>

        </button>



        {/* Mobile Menu */}
        <div
          className={`absolute top-[70px] left-0 w-full bg-white shadow-sm p-6 md:hidden transition-all ${
            openMenu ? "block" : "hidden"
          }`}
        >

          <ul className="flex flex-col space-x-4 space-y-4 text-lg">

            <li>
              <a href="#" className="text-sm">
                Home
              </a>
            </li>

            <li>
              <a href="#" className="text-sm">
                Services
              </a>
            </li>

            <li>
              <a href="#" className="text-sm">
                Portfolio
              </a>
            </li>

            <li>
              <a href="#" className="text-sm">
                Pricing
              </a>
            </li>

          </ul>


          <button
            className="bg-white text-gray-600 border border-gray-300 mt-6 text-sm hover:bg-gray-50 active:scale-95 transition-all w-40 h-11 rounded-full"
          >
            Get started
          </button>

        </div>

      </nav>

    </div>
  );
}