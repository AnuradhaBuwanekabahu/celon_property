import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { clientContext } from '../context/ClientContext.jsx';
import { overviewOptions, highlightOptions, cityOptions } from '../Assets/data.js';
import { Upload, X, ImagePlus } from 'lucide-react';

const EditStayToBuyProfile = ({ propertyId }) => {
    const { id } = useParams();
    const activeId = propertyId || id;

    const {
        stayFormData,
        handleStayChange,
        handleStayOverviewChange,
        removeStayOverview,
        addStayOverview,
        handleStayHighlightChange,
        stayMainImagePreview,
        handleStayMainImage,
        removeStayMainImage,
        stayMainVideoPreview,
        handleStayMainVideo,
        removeStayMainVideo,
        stayGalleryImages,
        STAY_MAX_GALLERY_IMAGES,
        stayGalleryDragActive,
        setStayGalleryDragActive,
        handleStayGalleryDrop,
        handleStayImages,
        removeStayGalleryImage,
        handleStayToBuyEditSubmit,
        fetchStayToBuyForEdit,
    } = useContext(clientContext);

    useEffect(() => {
        if (activeId) fetchStayToBuyForEdit(activeId);
    }, [activeId, fetchStayToBuyForEdit]);

    return (
        <div className="max-w-6xl mt-8 mx-auto p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#14213D] mb-5">
                Edit Property
            </h2>

            <form onSubmit={(e) => handleStayToBuyEditSubmit(e, activeId)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="title"
                        value={stayFormData.title}
                        onChange={handleStayChange}
                        placeholder="Property title"
                        className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    />
                    <input
                        type="number"
                        name="price"
                        value={stayFormData.price}
                        onChange={handleStayChange}
                        placeholder="Price (RS)"
                        className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    />
                </div>

                <textarea
                    name="description"
                    value={stayFormData.description}
                    onChange={handleStayChange}
                    placeholder="Enter description here..."
                    rows={4}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select
                        name="property_type"
                        value={stayFormData.property_type}
                        onChange={handleStayChange}
                        className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FCA311]"
                    >
                        <option value="">Select property type</option>
                        <option value="House">House</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Bungalow">Bungalow</option>
                        <option value="Hotel">Hotel</option>
                        <option value="WareHouse">WareHouse</option>
                        <option value="Villa">Villa</option>
                        <option value="Studio">Studio</option>
                    </select>

                    <select
                        name="city"
                        value={stayFormData.city}
                        onChange={handleStayChange}
                        className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FCA311]"
                    >
                        <option value="">Select City</option>
                        {cityOptions.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select
                        name="duration"
                        value={stayFormData.duration}
                        onChange={handleStayChange}
                        className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FCA311]"
                    >
                        <option value="year">Year</option>
                        <option value="month">Month</option>
                        <option value="day">Day</option>
                    </select>
                </div>

                <div className="space-y-3 border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-lg text-[#14213D]">Overview</h3>
                    <p className="text-xs text-gray-500">Choose a title from the list and enter only the value.</p>

                    {Array.isArray(stayFormData.overview) && stayFormData.overview.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <select
                                value={item.title}
                                onChange={(e) => handleStayOverviewChange(index, 'title', e.target.value)}
                                className="border border-gray-300 p-3 rounded-xl text-sm w-full sm:w-1/2"
                            >
                                {overviewOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="Enter value"
                                value={item.value}
                                onChange={(e) => handleStayOverviewChange(index, 'value', e.target.value)}
                                className="border border-gray-300 p-3 rounded-xl text-sm w-full sm:w-1/2"
                            />

                            <button
                                type="button"
                                onClick={() => removeStayOverview(index)}
                                className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm shrink-0"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addStayOverview}
                        className="bg-[#FCA311] px-4 py-2 rounded-xl text-sm font-medium w-full sm:w-auto"
                    >
                        + Add Overview
                    </button>
                </div>

                <div className="space-y-3 border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-lg text-[#14213D]">Highlights</h3>
                    <p className="text-xs text-gray-500">Select property highlights</p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                        {highlightOptions.map((highlight) => (
                            <label
                                key={highlight}
                                className="flex items-center gap-2 border border-gray-300 p-2.5 rounded-xl text-sm cursor-pointer hover:bg-gray-50"
                            >
                                <input
                                    type="checkbox"
                                    checked={Array.isArray(stayFormData.highlights) && stayFormData.highlights.includes(highlight)}
                                    onChange={() => handleStayHighlightChange(highlight)}
                                />
                                <span>{highlight}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                        type="number"
                        name="area_sqft"
                        value={stayFormData.area_sqft}
                        onChange={handleStayChange}
                        placeholder="Area (sqft)"
                        className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    />
                    <input
                        type="text"
                        name="map_address"
                        value={stayFormData.map_address}
                        onChange={handleStayChange}
                        placeholder="Map address"
                        className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    />
                </div>

                <input
                    type="text"
                    name="location"
                    value={stayFormData.location}
                    onChange={handleStayChange}
                    placeholder="Enter your location address"
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#14213D]">Main Image</label>

                        <div
                            onClick={() => document.getElementById('stayMainImageInput').click()}
                            className={`relative w-full h-44 sm:h-56 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-colors border-gray-300 hover:border-[#FCA311]`}
                        >
                            {!stayMainImagePreview ? (
                                <>
                                    <Upload className="w-7 h-7 text-[#FCA311] mb-2" />
                                    <span className="text-gray-600 text-sm font-medium">Tap to upload main image</span>
                                    <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</span>
                                </>
                            ) : (
                                <>
                                    <img src={stayMainImagePreview} alt="main preview" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            removeStayMainImage();
                                        }}
                                        className="absolute top-2 right-2 bg-[#14213D]/80 text-white rounded-full p-1.5"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                            )}

                            <input id="stayMainImageInput" type="file" accept="image/*" onChange={handleStayMainImage} className="hidden" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#14213D]">Main Video</label>

                        <div
                            onClick={() => document.getElementById('stayMainVideoInput').click()}
                            className={`relative w-full h-44 sm:h-56 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-colors border-gray-300 hover:border-[#FCA311]`}
                        >
                            {!stayMainVideoPreview ? (
                                <>
                                    <Upload className="w-7 h-7 text-[#FCA311] mb-2" />
                                    <span className="text-gray-600 text-sm font-medium">Tap to upload main video (optional)</span>
                                    <span className="text-xs text-gray-400 mt-1">MP4</span>
                                </>
                            ) : (
                                <>
                                    <video src={stayMainVideoPreview} controls className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            removeStayMainVideo();
                                        }}
                                        className="absolute top-2 right-2 bg-[#14213D]/80 text-white rounded-full p-1.5"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                            )}

                            <input id="stayMainVideoInput" type="file" accept="video/*" onChange={handleStayMainVideo} className="hidden" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#14213D]">
                        Gallery Images ({stayGalleryImages.length}/{STAY_MAX_GALLERY_IMAGES})
                    </label>

                    <div
                        onDragOver={(e) => { e.preventDefault(); setStayGalleryDragActive(true); }}
                        onDragLeave={() => setStayGalleryDragActive(false)}
                        onDrop={handleStayGalleryDrop}
                        onClick={() => stayGalleryImages.length < STAY_MAX_GALLERY_IMAGES && document.getElementById('stayGalleryInput').click()}
                        className={`flex flex-col items-center justify-center gap-1.5 border-2 border-dashed rounded-xl p-5 sm:p-6 cursor-pointer transition-colors
                            ${stayGalleryDragActive ? 'border-[#FCA311] bg-orange-50' : 'border-gray-300 hover:border-[#FCA311]'}
                            ${stayGalleryImages.length >= STAY_MAX_GALLERY_IMAGES ? 'opacity-50 pointer-events-none' : ''}
                        `}
                    >
                        <Upload className="w-6 h-6 text-[#FCA311]" />
                        <p className="text-sm text-gray-600 font-medium text-center">
                            Tap to upload, or drag & drop images here
                        </p>
                        <p className="text-xs text-gray-400">
                            JPG, PNG, WEBP — up to {STAY_MAX_GALLERY_IMAGES} images
                        </p>

                        <input
                            id="stayGalleryInput"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleStayImages}
                            className="hidden"
                        />
                    </div>

                    {stayGalleryImages.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-3">
                            {stayGalleryImages.map((img) => (
                                <div
                                    key={img.id}
                                    className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200"
                                >
                                    <img
                                        src={img.preview}
                                        alt="gallery preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => removeStayGalleryImage(e, img.id)}
                                        className="absolute top-1 right-1 bg-[#14213D]/80 text-white rounded-full p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}

                            {stayGalleryImages.length < STAY_MAX_GALLERY_IMAGES && (
                                <div
                                    onClick={() => document.getElementById('stayGalleryInput').click()}
                                    className="flex items-center justify-center aspect-square rounded-xl border border-dashed border-gray-300 text-[#FCA311] cursor-pointer hover:border-[#FCA311]"
                                >
                                    <ImagePlus className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 bg-white pt-3 pb-1 -mx-4 px-4 flex justify-center sm:static sm:bg-transparent sm:mx-0 sm:px-0">
                    <button
                        type="submit"
                        className="w-full sm:w-auto bg-[#14213D] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#1c2c52] transition-colors"
                    >
                        Edit Property
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditStayToBuyProfile;