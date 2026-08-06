import React, { useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { FiChevronDown, FiX } from "react-icons/fi";
import { IoReorderThreeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function DashboardSidebar() {

  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState(null);
  const [showMenu, setShowMenu] = useState(false);


  const menuItems = [
  
    {
      name: "Hot Sales",
      children: [
        { title: "Create Hot Sale", path: "/dashboard/add-hotsales" },
        { title: "View Hot Sales", path: "/dashboard" },
        { title: "Edit Hot Sale", path: "/dashboard" },
        { title: "Delete Hot Sale", path: "/dashboard" },
      ],
    },

    {
      name: "Stays To Buy",
      children: [
        { title: "Create Stay", path: "/dashboard/stays-buy/create" },
        { title: "View Stays", path: "/dashboard/stays-buy/view" },
        { title: "Edit Stay", path: "/dashboard/stays-buy/edit" },
        { title: "Delete Stay", path: "/dashboard/stays-buy/delete" },
      ],
    },


    {
      name: "Stays To Rent",
      children: [
        { title: "Create Rent", path: "/dashboard/stays-rent/create" },
        { title: "View Rents", path: "/dashboard/stays-rent/view" },
        { title: "Edit Rent", path: "/dashboard/stays-rent/edit" },
        { title: "Delete Rent", path: "/dashboard/stays-rent/delete" },
      ],
    },


    {
      name: "Lands",
      children: [
        { title: "Create Land", path: "/dashboard/lands/create" },
        { title: "View Lands", path: "/dashboard/lands/view" },
        { title: "Edit Land", path: "/dashboard/lands/edit" },
        { title: "Delete Land", path: "/dashboard/lands/delete" },
      ],
    },


    {
      name: "Advertisement",
      children: [
        { title: "Create Advertisement", path: "/dashboard/ads/create" },
        { title: "View Advertisements", path: "/dashboard/ads/view" },
        { title: "Edit Advertisement", path: "/dashboard/ads/edit" },
        { title: "Delete Advertisement", path: "/dashboard/ads/delete" },
      ],
    },
  ];



  return (
    <div className="fixed top-8 left-0  w-72  h-screen bg-[#14213D] text-white">


      {/* Mobile Header */}
      <div className="sm:hidden bg-[#14213D] h-16 flex items-center justify-between px-5 shadow-md">

        <h1 className="text-lg font-bold">
          Ceylone Property
        </h1>


        <button 
          onClick={() => setShowMenu(!showMenu)}
        >

          {
            showMenu 
            ? 
            <FiX className="text-3xl" />
            :
            <IoReorderThreeOutline className="text-3xl" />
          }

        </button>

      </div>




      {/* Sidebar */}

      <aside
        className={`
        w-full h-full 
        transform transition-transform duration-300
        ${
          showMenu 
          ? "translate-x-0" 
          : "-translate-x-full"
        }
        sm:translate-x-0 sm:static
        `}
      >



        {/* Desktop Header */}

        <div className="hidden sm:block p-5 border-b border-gray-600">


          <div className="flex justify-between items-center">

            <h1 className="text-xl font-bold">
              Ceylone Property
            </h1>


            <IoIosNotifications className="text-3xl"/>

          </div>



          <div className="flex items-center gap-3 mt-5">

            <img
              className="w-12 h-12 rounded-full"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
              alt="profile"
            />


            <div>

              <h3 className="font-semibold">
                Admin
              </h3>

              <p className="text-xs text-gray-300">
                Online
              </p>

            </div>

          </div>


        </div>





        {/* Mobile Profile */}

        <div className="sm:hidden p-5 border-b border-gray-600">


          <div className="flex items-center gap-3">


            <img
              className="w-12 h-12 rounded-full"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
              alt="profile"
            />


            <div>

              <h3 className="font-semibold">
                Admin
              </h3>

              <p className="text-xs text-gray-300">
                Online
              </p>

            </div>


          </div>


        </div>







        {/* Menu */}

        <div className="p-4">


          <h2 className="text-lg font-semibold mb-5">
            Dashboard
          </h2>


            <div
      className="mb-2 cursor-pointer"
      onClick={() => navigate('/dashboard')}
    >
      <span
        className="flex items-center justify-between 
        w-full px-4 py-3 rounded-lg
        hover:bg-[#FCA311] hover:text-black transition"
      >
        Home
      </span>
    </div>
          {
            menuItems.map((item,index)=>(


              <div 
                key={index}
                className="mb-2"
              >



                {/* Main Menu */}

                <button

                  onClick={() =>
                    setActiveMenu(
                      activeMenu === index 
                      ? null 
                      : index
                    )
                  }

                  className="
                  flex items-center justify-between 
                  w-full px-4 py-3 rounded-lg
                  hover:bg-[#23345d]
                  transition
                  "

                >

                  <span>
                    {item.name}
                  </span>



                  <FiChevronDown

                    className={`
                    transition-transform
                    ${
                      activeMenu === index
                      ? "rotate-180"
                      : ""
                    }
                    `}

                  />


                </button>





                {/* Child Menu */}

                {
                  activeMenu === index && (

                    <div className="ml-5 mt-2 space-y-1">


                      {
                        item.children.map((child,i)=>(


                          <button

                            key={i}

                            onClick={()=>{
                              navigate(child.path);
                              setShowMenu(false);
                            }}


                            className="
                            block w-full text-left
                            text-sm px-3 py-2
                            rounded text-gray-200
                            hover:bg-[#FCA311]
                            hover:text-black
                            transition
                            "

                          >

                            {child.title}


                          </button>


                        ))
                      }


                    </div>

                  )
                }



              </div>


            ))
          }



        </div>

      </aside>


    </div>
  );
}