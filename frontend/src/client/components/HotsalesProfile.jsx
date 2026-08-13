import React, { useContext, useEffect, useState } from 'react'
import { clientContext } from '../context/ClientContext';
import { ArrowLeft, MapPin, Phone, MessageCircle, Bed, Bath, Home, Ruler, X } from 'lucide-react';

const getOverviewIcon = (title = '') => {
    const t = title.toLowerCase();
    if (t.includes('bed')) return Bed;
    if (t.includes('bath')) return Bath;
    if (t.includes('floor') || t.includes('sqft') || t.includes('area')) return Ruler;
    return Home;
};

const HotsalesProfile = ({ hotsaleID, onBack }) => {

    const { getHotSaleById, selectedProperty } = useContext(clientContext);
    const [showGallery, setShowGallery] = useState(false);

    useEffect(() => {
        getHotSaleById(hotsaleID);
    }, [hotsaleID]);

    if (!selectedProperty) return null;

    const otherImages = selectedProperty.gallery_images || [];
    const visibleThumbs = otherImages.slice(0, 4);
    const remainingCount = otherImages.length > 4 ? otherImages.length - 4 : 0;

    return (
        <div className='w-full h-auto px-3 sm:px-6 lg:px-8 pb-8 max-w-5xl mx-auto'>

            {/* Header */}
            <button onClick={onBack} className='flex items-center gap-2 text-base sm:text-lg font-semibold text-[#14213D] mb-3 sm:mb-4'>
                <ArrowLeft size={20} /> Back
            </button>

            {/* Image gallery: main image + thumbnail grid */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
                <div className='sm:col-span-2 h-[220px] sm:h-[260px] md:h-[320px] rounded-xl overflow-hidden'>
                    <img
                        src={selectedProperty.main_image}
                        alt={selectedProperty.title}
                        className='w-full h-full object-cover'
                    />
                </div>

                <div className='grid grid-cols-4 sm:grid-cols-2 gap-2'>
                    {visibleThumbs.map((img, idx) => {
                        const isLast = idx === 3 && remainingCount > 0;
                        return (
                            <div key={idx} className='relative h-[60px] sm:h-[95px] md:h-[152px] rounded-lg overflow-hidden'>
                                <img src={img} alt={`${selectedProperty.title}-${idx}`} className='w-full h-full object-cover' />
                                {isLast && (
                                    <button
                                        onClick={() => setShowGallery(true)}
                                        className='absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[10px] sm:text-xs md:text-sm font-medium'
                                    >
                                        See More
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Contact bar */}
            <div className='flex flex-wrap items-center justify-between gap-2 bg-[#14213D] text-white rounded-lg px-3 sm:px-4 py-2 mt-3'>
                <a
                    href={`https://wa.me/${selectedProperty.owner_phone}`}
                    target='_blank'
                    rel='noreferrer'
                    className='bg-[#25D366] p-2 rounded-full shrink-0'
                >
                    <MessageCircle size={16} className='text-white' />
                </a>

                <div className='flex items-center gap-2 order-3 sm:order-2 w-full sm:w-auto justify-center sm:justify-start'>
                    <span className='bg-[#FCA311] text-[#14213D] text-[10px] sm:text-xs font-semibold px-2 py-1 rounded'>
                        Owner
                    </span>
                    <span className='text-xs sm:text-sm font-medium truncate max-w-[140px] sm:max-w-none'>
                        {selectedProperty.owner_name}
                    </span>
                </div>

                <div className='flex items-center gap-1 text-xs sm:text-sm order-2 sm:order-3 shrink-0'>
                    <Phone size={14} />
                    <span>{selectedProperty.owner_phone}</span>
                </div>
            </div>

            {/* Title */}
            <h1 className='text-lg sm:text-xl md:text-2xl font-bold text-[#14213D] mt-4 leading-snug'>
                {selectedProperty.title}
            </h1>

            {/* Location */}
            <div className='flex items-center gap-1 text-gray-500 text-xs sm:text-sm mt-1'>
                <MapPin size={15} className='shrink-0' />
                <span>{selectedProperty.location}</span>
            </div>

            {/* Price / Sqft / Land area */}
            <div className='flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-1.5 mt-3 text-xs sm:text-sm'>
                <p><span className='font-semibold text-[#14213D]'>Price: </span>
                    Rs. {Number(selectedProperty.price).toLocaleString()}
                </p>
                <p><span className='font-semibold text-[#14213D]'>Sq.Ft: </span>{selectedProperty.area_sqft}</p>
                <p><span className='font-semibold text-[#14213D]'>Area of Land: </span>{selectedProperty.land_area} perches</p>
            </div>

            {/* Overview */}
            {selectedProperty.overview?.length > 0 && (
                <>
                    <h2 className='text-base sm:text-lg font-semibold text-[#14213D] mt-5 sm:mt-6 mb-2'>Overview</h2>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3'>
                        {selectedProperty.overview.map((item, idx) => {
                            const Icon = getOverviewIcon(item.title);
                            return (
                                <div
                                    key={idx}
                                    className='bg-[#FCA311]/10 border border-[#FCA311]/30 rounded-lg p-2.5 sm:p-3 flex flex-col items-center text-center gap-1'
                                >
                                    <Icon size={18} className='text-[#14213D]' />
                                    <span className='text-[10px] sm:text-xs text-gray-500'>{item.title}</span>
                                    <span className='text-xs sm:text-sm font-semibold text-[#14213D]'>{item.value}</span>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Description */}
            <h2 className='text-base sm:text-lg font-semibold text-[#14213D] mt-5 sm:mt-6 mb-2'>Description</h2>
            <p className='text-xs sm:text-sm text-gray-600 leading-relaxed'>{selectedProperty.description}</p>

            {/* Features */}
            {selectedProperty.highlights?.length > 0 && (
                <>
                    <h2 className='text-base sm:text-lg font-semibold text-[#14213D] mt-5 sm:mt-6 mb-2'>Features</h2>
                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3'>
                        {selectedProperty.highlights.map((feature, idx) => (
                            <div key={idx} className='flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2.5 sm:px-3 py-2'>
                                <div className='bg-[#14213D]/10 p-1.5 rounded shrink-0'>
                                    <Home size={15} className='text-[#14213D]' />
                                </div>
                                <span className='text-xs sm:text-sm text-gray-700 truncate'>{feature}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Video — replaces the bottom house images */}
            {selectedProperty.main_video && (
                <div className='mt-5 sm:mt-6'>
                    <h2 className='text-base sm:text-lg font-semibold text-[#14213D] mb-2'>Property Video</h2>
                    <video
                        src={selectedProperty.main_video}
                        controls
                        className='w-full rounded-xl max-h-[240px] sm:max-h-[320px] md:max-h-[400px] object-cover bg-black'
                    />
                </div>
            )}

            {/* Full gallery modal */}
            {showGallery && (
                <div
                    className='fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 sm:p-4'
                    onClick={() => setShowGallery(false)}
                >
                    <button className='absolute top-4 right-4 text-white' onClick={() => setShowGallery(false)}>
                        <X size={26} />
                    </button>
                    <div
                        className='grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 max-h-[80vh] overflow-y-auto w-full max-w-3xl'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {otherImages.map((img, idx) => (
                            <img key={idx} src={img} alt={`gallery-${idx}`} className='w-full h-36 sm:h-48 object-cover rounded-lg' />
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}

export default HotsalesProfile