import React from 'react'
import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import API from '../api/clientapi.js';

const DeleteAds = ({ clientID }) => {
    const navigate = useNavigate();
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const resolveImageUrl = (image) => {
        if (!image) return '';
        if (typeof image === 'string' && image.startsWith('http')) {
            return image;
        }
        if (typeof image === 'string' && image.startsWith('/')) {
            return `${API.defaults.baseURL}${image}`;
        }
        return image;
    };

    useEffect(() => {
        const fetchAds = async () => {
            try {
                setLoading(true);
                const response = await API.get('/api/ads/showall');
                const data = response.data?.ads || [];
                setAds(data.filter((item) => Number(item.client_id) === Number(clientID)));
            } catch (error) {
                console.error(error);
            } finally {
                
                setLoading(false);
            }
        };

        fetchAds();
    }, [clientID]);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    const filteredAds = ads.filter((item) => {
        const searchText = search.toLowerCase();

        return (
            item.title?.toLowerCase().includes(searchText) ||
            item.position?.toLowerCase().includes(searchText) ||
            item.link_url?.toLowerCase().includes(searchText)
        );
    });

    return (
           <div className='mt-10 ml-10 min-h-screen bg-[#F5F7FB] p-4'>
   
   
               {/* Search Bar */}
               <div className="mt-10 ml-10 flex items-center border gap-2 p-2 border-gray-950 rounded-3xl h-[46px] overflow-hidden max-w-md w-full mb-5">
   
                   <svg 
                       xmlns="http://www.w3.org/2000/svg" 
                       width="30" 
                       height="30" 
                       viewBox="0 0 30 30" 
                       fill="#6B7280"
                   >
                       <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8"/>
                   </svg>
   
   
                   <input 
                       type="text"
                       value={search}
                       onChange={(e)=>setSearch(e.target.value)}
                       placeholder="Search by name, city or property type"
                       className="w-full h-full outline-none placeholder-gray-500 text-gray-500 bg-transparent text-sm"
                   />
   
   
                   <button 
                       type="button"
                       onClick={()=>setSearch("")}
                       className="bg-[#14213D] w-32 h-9 rounded-full text-sm text-white hover:bg-amber-400"
                   >
                       Clear
                   </button>
   
               </div>
   
   
   
               {
                   filteredAds.length === 0 ? (
   
                       <h2 className="text-gray-500 ml-10">
                           No advertisements found
                       </h2>
   
                   ) : (
   
   
                       <div className="mt-6 grid grid-cols-3 gap-5 ml-10">
   
   
                                                     {filteredAds.map((item) => (

                                                             <div key={item.id}>

                                                                    <div className="relative left-24 w-[300px] h-[350px] rounded-xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer" onClick={() => navigate(`/dashboard/ads/view/${item.id}`)}>
                                                                 
                                                                                        <img
                                                                                                src={resolveImageUrl(item.image)}
                                                                                                alt={item.title}
                                                                                                className="w-full h-full object-cover"
                                                                                        />
                                                                 
                                                                             {/* Badge */}
                                                                             <div className="absolute top-3 left-3 bg-[#14213D] text-white px-4 py-1 rounded-full text-sm">
                                                                                 {item.position || 'Ad'}
                                                                             </div>
                                                                 
                                                                             {/* Info Card */}
                                                                             <div className="absolute bottom-4 left-4 w-[260px] bg-white rounded-2xl p-4">
                                                                 
                                                                                 <p className="font-bold text-[15px]">
                                                                                     {item.title}
                                                                                 </p>
                                                                 
                                                                                 <p className="text-[11px] text-gray-500 mt-1 truncate">
                                                                                     {item.link_url || 'No link provided'}
                                                                                 </p>
                                                                 
                                   
                                                                                 <div className="flex items-center gap-2 mt-3">
                                                                                     <p className="font-bold text-[16px]">
                                                                                         {item.is_active ? 'Active' : 'Inactive'}
                                                                                     </p>

                                                                                     <div className="ml-auto flex items-center gap-2">
                                                                                         <Trash2 className="text-red-700 cursor-pointer" onClick={async (e) => {
                                                                                                 e.stopPropagation();
                                                                                                 if (!confirm('Delete this advertisement?')) return;
                                                                                                 try {
                                                                                                         await API.delete(`/api/ads/delete/${item.id}`);
                                                                                                         setAds((prev) => prev.filter((a) => a.id !== item.id));
                                                                                                         toast.success('Advertisement deleted');
                                                                                                 } catch (err) {
                                                                                                         console.error(err);
                                                                                                         toast.error('Failed to delete advertisement');
                                                                                                 }
                                                                                         }} />
                                                                                     </div>
                                                                                 </div>
                                                                 
                                                                             </div>
                                                                 
                                                                         </div>
                                 

                                                             </div>


                                                     ))}
   
   
                       </div>
   
   
                   )
               }
   
   
           </div>
       );
   };
   
export default DeleteAds;