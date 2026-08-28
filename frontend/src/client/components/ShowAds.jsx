import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/clientapi.js';

const ShowAds = ({ clientID }) => {
    const navigate = useNavigate();
    const [ads, setAds] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                setLoading(true);
                const response = await API.get('/api/ads/ads');
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

    const filteredAds = ads.filter((item) => {
        const searchText = search.toLowerCase();
        return (
            item.title?.toLowerCase().includes(searchText) ||
            item.link_url?.toLowerCase().includes(searchText)
        );
    });

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

    const handleCardClick = (item) => {
        if (item.link_url) {
            window.open(item.link_url, '_blank', 'noopener,noreferrer');
            return;
        }
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#F5F7FB] px-3 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-5 flex flex-col gap-2 rounded-[24px] border border-gray-200 bg-white p-2 shadow-sm sm:flex-row sm:items-center sm:gap-2 sm:p-3">
                    <div className="flex flex-1 items-center gap-2 rounded-[18px] border border-gray-300 bg-[#F8FAFC] px-3 py-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 30 30" fill="#6B7280" className="shrink-0">
                            <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title or link"
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

                {loading ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
                        Loading ads...
                    </div>
                ) : filteredAds.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
                        No advertisements found
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredAds.map((item) => (
                            <div key={item.id}>
                                <div
                                    onClick={() => handleCardClick(item)}
                                    className="relative mx-auto h-[320px] w-full max-w-[320px] overflow-hidden rounded-xl shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:h-[340px] sm:max-w-none"
                                >
                                    <img
                                        src={resolveImageUrl(item.image)}
                                        alt={item.title}
                                        className="h-full w-full object-cover"
                                    />

                                    <div className="absolute left-3 top-3 rounded-full bg-[#14213D] px-4 py-1 text-sm text-white">
                                        {item.position || 'Ad'}
                                    </div>

                                    <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white p-4 shadow-sm">
                                        <p className="font-bold text-[15px] text-slate-800">{item.title}</p>
                                        <p className="mt-1 truncate text-[11px] text-gray-500">
                                            {item.link_url || 'No link provided'}
                                        </p>

                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="rounded-full bg-[#FCA311] px-3 py-1 text-[11px] font-semibold text-white">
                                                Open
                                            </span>
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

export default ShowAds;