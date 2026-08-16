import React, { useContext, useEffect, useState } from 'react';
import { clientContext } from '../context/ClientContext';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ShowStaytorent = ({ clientID }) => {
    const navigate = useNavigate();
    const { stayToRent, getStayToRent } = useContext(clientContext);
    const [search, setSearch] = useState("");
    const stayToRentList = Array.isArray(stayToRent) ? stayToRent : [];

    useEffect(() => {
        getStayToRent();
    }, []);

    const clientStayToRent = stayToRentList.filter(
        (item) => Number(item.client_id) === Number(clientID)
    );

    const filteredStayToRent = clientStayToRent.filter((item) => {
        const searchText = search.toLowerCase();
        return (
            item.title?.toLowerCase().includes(searchText) ||
            item.city?.toLowerCase().includes(searchText) ||
            item.property_type?.toLowerCase().includes(searchText)
        );
    });

    return (
        <div className="min-h-screen bg-[#F5F7FB] px-3 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-5 flex flex-col gap-2 rounded-[24px] border border-gray-200 bg-white p-2 shadow-sm sm:flex-row sm:items-center sm:gap-2 sm:p-3">
                    <div className="flex flex-1 items-center gap-2 rounded-[18px] border border-gray-300 bg-[#F8FAFC] px-3 py-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 30 30" fill="#6B7280" className="shrink-0">
                            <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8"/>
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, city or property type"
                            className="h-full w-full bg-transparent text-sm outline-none placeholder-gray-500"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="w-full rounded-full bg-[#14213D] px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-400 sm:w-28"
                    >
                        Clear
                    </button>
                </div>

                {filteredStayToRent.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
                        No properties found
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredStayToRent.map((item) => (
                            <div key={item.id}>
                                <div
                                    onClick={() => navigate(`/dashboard/stays-rent/profile/${item.id}`, { state: { clientID } })}
                                    className="relative mx-auto h-[320px] w-full max-w-[320px] overflow-hidden rounded-xl shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:h-[340px] sm:max-w-none"
                                >
                                    <img src={item.main_image} alt={item.title} className="h-full w-full object-cover" />

                                    <div className="absolute left-3 top-3 rounded-full bg-[#14213D] px-4 py-1 text-sm text-white">
                                        {item.property_type}
                                    </div>

                                    <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white p-4 shadow-sm">
                                        <p className="font-bold text-[15px] text-slate-800">{item.title}</p>
                                        <p className="mt-1 text-[11px] text-gray-500">{item.location}</p>

                                        <div className="mt-3 flex items-center justify-between">
                                            <p className="font-bold text-[16px] text-slate-800">
                                                RS.{item.price}
                                                <span className="text-[11px] font-normal text-gray-500"> /{item.duration}</span>
                                            </p>

                                            <div className="flex items-center gap-1">
                                                <FaStar className="text-yellow-400" />
                                                <span className="text-sm font-medium text-slate-700">{item.rate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShowStaytorent;
