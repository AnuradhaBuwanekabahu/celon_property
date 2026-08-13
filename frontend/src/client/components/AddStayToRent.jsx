import React from "react";
import { toast } from "react-toastify";
import {
  overviewOptions,
  highlightOptions,
  cityOptions,
} from "../Assets/data.js";
import { Upload, X, ImagePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { clientContext } from "../context/ClientContext.jsx";

const AddStayToRent = ({ clientID }) => {
  const navigate = useNavigate();
  const {
    staytorentImage,
    staytorentMainImagePreview,
    staytorentMainVideo,
    staytorentMainVideoPreview,
    staytorentGalleryImages,
    staytorentGalleryImagesActive,
    staytorentFormData,
    handleStayToRentChange,
    addStaytoRentoverview,
    removeStayToRentOverview,
    handleStaytorentOverviewChange,
    handleStaytorentHighlightschanges,
    handleStaytorentImages,
    handleStaytorentmainImage,
    removeStaytorentMainImage,
    handlestaytorentMainVideo,
    removestaytorentmainVideo,
    handleStaytorentSubmit,
    STAY_MAX_GALLERY_IMAGES,
    setstaytorentGallery,
    removeStaytorentGalleryImages,
    handleStayImages 
  } = useContext(clientContext);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const resolvedClientId = clientID || localStorage.getItem("clientId");

    if (!resolvedClientId) {
      toast.error("Unable to identify the client. Please try again.");
      return;
    }

    const requiredFields = [
      staytorentFormData.title,
      staytorentFormData.price,
      staytorentFormData.description,
      staytorentFormData.property_type,
      staytorentFormData.city,
      staytorentFormData.area_sqft,
      staytorentFormData.map_address,
      staytorentFormData.location,
    ];

    const hasEmptyOverview = staytorentFormData.overview.some(
      (item) => !item.title || !item.value,
    );

    if (
      requiredFields.some((field) => !field) ||
      hasEmptyOverview ||
      !staytorentImage
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    handleStaytorentSubmit(e, resolvedClientId);
  };

  return (
    <div className="max-w-6xl mt-8 mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-[#14213D] mb-5">
        Add Stay To Rent Property
      </h2>

      <form onSubmit={handleFormSubmit} className="space-y-5">
        {/* Basic details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={staytorentFormData.title}
            onChange={handleStayToRentChange}
            placeholder="Property title"
            required
            className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
          />
          <input
            type="number"
            name="price"
            value={staytorentFormData.price}
            onChange={handleStayToRentChange}
            placeholder="Price (RS)"
            required
            className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
          />
        </div>

        <textarea
          name="description"
          value={staytorentFormData.description}
          onChange={handleStayToRentChange}
          placeholder="Enter description here..."
          rows={4}
          required
          className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            name="property_type"
            value={staytorentFormData.property_type}
            onChange={handleStayToRentChange}
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
            value={staytorentFormData.city}
            onChange={handleStayToRentChange}
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
            value={staytorentFormData.duration}
            onChange={handleStayToRentChange}
            className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FCA311]"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
            <option value="permanent">Permanent</option>
          </select>
        </div>

        {/* Overview */}
        <div className="space-y-3 border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-lg text-[#14213D]">Overview</h3>
          <p className="text-xs text-gray-500">
            Choose a title from the list and enter only the value.
          </p>

          {staytorentFormData.overview.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row gap-2 sm:gap-3"
            >
              <select
                value={item.title}
                onChange={(e) =>
                  handleStaytorentOverviewChange(index, "title", e.target.value)
                }
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
                onChange={(e) =>
                  handleStaytorentOverviewChange(index, "value", e.target.value)
                }
                className="border border-gray-300 p-3 rounded-xl text-sm w-full sm:w-1/2"
              />

              <button
                type="button"
                onClick={() => removeStayToRentOverview(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm shrink-0"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addStaytoRentoverview}
            className="bg-[#FCA311] px-4 py-2 rounded-xl text-sm font-medium w-full sm:w-auto"
          >
            + Add Overview
          </button>
        </div>

        {/* Highlights */}
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
                  checked={staytorentFormData.highlights.includes(highlight)}
                  onChange={() => handleStaytorentHighlightschanges(highlight)}
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
            value={staytorentFormData.area_sqft}
            onChange={handleStayToRentChange}
            placeholder="Area (sqft)"
            required
            className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
          />
          <input
            type="text"
            name="map_address"
            value={staytorentFormData.map_address}
            onChange={handleStayToRentChange}
            placeholder="Map address"
            required
            className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
          />
        </div>

        <input
          type="text"
          name="location"
          value={staytorentFormData.location}
          onChange={handleStayToRentChange}
          placeholder="Enter your location address"
          required
          className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
        />

        {/* Main Image & Video upload */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Main Image */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#14213D]">
              Main Image
            </label>

            <div
              onClick={() => document.getElementById("stayMainImageInput")?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  document.getElementById("stayMainImageInput")?.click();
                }
              }}
              role="button"
              tabIndex={0}
              className="relative w-full h-44 sm:h-56 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-colors border-gray-300 hover:border-[#FCA311]"
            >
              {!staytorentMainImagePreview ? (
                <>
                  <Upload className="w-7 h-7 text-[#FCA311] mb-2" />
                  <span className="text-gray-600 text-sm font-medium">
                    Tap to upload main image
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    JPG, PNG, WEBP
                  </span>
                </>
              ) : (
                <>
                  <img
                    src={staytorentMainImagePreview}
                    alt="main preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeStaytorentMainImage();
                    }}
                    className="absolute top-2 right-2 bg-[#14213D]/80 text-white rounded-full p-1.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}

              <input
                id="stayMainImageInput"
                type="file"
                accept="image/*"
                onChange={handleStaytorentmainImage}
                className="hidden"
              />
            </div>
          </div>

          {/* Main Video */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#14213D]">
              Main Video
            </label>

            <div
              onClick={() =>
                document.getElementById("stayMainVideoInput").click()
              }
              className="relative w-full h-44 sm:h-56 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-colors border-gray-300 hover:border-[#FCA311]"
            >
              {!staytorentMainVideoPreview ? (
                <>
                  <Upload className="w-7 h-7 text-[#FCA311] mb-2" />
                  <span className="text-gray-600 text-sm font-medium">
                    Tap to upload main video (optional)
                  </span>
                  <span className="text-xs text-gray-400 mt-1">MP4</span>
                </>
              ) : (
                <>
                  <video
                    src={staytorentMainVideoPreview}
                    controls
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removestaytorentmainVideo();
                    }}
                    className="absolute top-2 right-2 bg-[#14213D]/80 text-white rounded-full p-1.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}

              <input
                id="stayMainVideoInput"
                type="file"
                accept="video/*"
                onChange={handlestaytorentMainVideo}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Gallery images upload */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#14213D]">
            Gallery Images ({staytorentGalleryImages.length}/{STAY_MAX_GALLERY_IMAGES}
            )
          </label>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setstaytorentGallery(true);
            }}
            onDragLeave={() => setstaytorentGallery(false)}
            onDrop={(e) => {
              e.preventDefault();
              setstaytorentGallery(false);
              if (e.dataTransfer?.files?.length) {
                handleStaytorentImages({ target: { files: e.dataTransfer.files } });
              }
            }}
            onClick={() => {
              if (staytorentGalleryImages.length < STAY_MAX_GALLERY_IMAGES) {
                document.getElementById("stayGalleryInput")?.click();
              }
            }}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && staytorentGalleryImages.length < STAY_MAX_GALLERY_IMAGES) {
                e.preventDefault();
                document.getElementById("stayGalleryInput")?.click();
              }
            }}
            role="button"
            tabIndex={0}
            className={`flex flex-col items-center justify-center gap-1.5 border-2 border-dashed rounded-xl p-5 sm:p-6 cursor-pointer transition-colors
                            ${staytorentGalleryImagesActive ? "border-[#FCA311] bg-orange-50" : "border-gray-300 hover:border-[#FCA311]"}
                            ${staytorentGalleryImages.length >= STAY_MAX_GALLERY_IMAGES ? "opacity-50 pointer-events-none" : ""}
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
              onChange={(e) => {
                if (e.target.files?.length) {
                  handleStaytorentImages(e);
                }
              }}
              className="hidden"
            />
          </div>

          {staytorentGalleryImages.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-3">
              {staytorentGalleryImages.map((img) => (
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
                    onClick={(e) => removeStaytorentGalleryImages(e, img.id)}
                    className="absolute top-1 right-1 bg-[#14213D]/80 text-white rounded-full p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {staytorentGalleryImages.length < STAY_MAX_GALLERY_IMAGES && (
                <div
                  onClick={() =>
                    document.getElementById("stayGalleryInput").click()
                  }
                  className="flex items-center justify-center aspect-square rounded-xl border border-dashed border-gray-300 text-[#FCA311] cursor-pointer hover:border-[#FCA311]"
                >
                  <ImagePlus className="w-5 h-5" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="sticky bottom-0 bg-white pt-3 pb-1 -mx-4 px-4 flex justify-center sm:static sm:bg-transparent sm:mx-0 sm:px-0">
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#14213D] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#1c2c52] transition-colors"
          >
            Submit Property
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStayToRent;
