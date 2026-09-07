import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/clientapi';
import { overviewOptions } from '../../assets/data.js';
import { Upload, X, ImagePlus } from 'lucide-react';

const EditLandsProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    land_size: '',
    size_unit: 'perches',
    duration: 'month',
    location: '',
    city: '',
    overview: [{ title: overviewOptions[0]?.value || '', value: '' }],
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [mainVideoFile, setMainVideoFile] = useState(null);
  const [mainVideoPreview, setMainVideoPreview] = useState(null);
  const [newGalleryImages, setNewGalleryImages] = useState([]);
  const [galleryDragActive, setGalleryDragActive] = useState(false);
  const [existingGalleryImages, setExistingGalleryImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLand = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/api/lands/show/${id}`);
        const payload = response?.data;
        const land = payload?.land ?? payload?.data ?? payload;

        setFormData({
          title: land.title || '',
          description: land.description || '',
          price: land.price || '',
          land_size: land.land_size || '',
          size_unit: land.size_unit || 'perches',
          duration: land.duration || 'month',
          location: land.location || '',
          city: land.city || '',
          overview: Array.isArray(land.overview) && land.overview.length > 0
            ? land.overview
            : [{ title: overviewOptions[0]?.value || '', value: '' }],
        });

        setMainImagePreview(land.main_image || (land.id ? `/api/lands/main-image/${land.id}` : null));
        setMainVideoPreview(land.main_video || (land.id ? `/api/lands/main-video/${land.id}` : null));
        setExistingGalleryImages(Array.isArray(land.images) ? land.images : Array.isArray(land.gallery_images) ? land.gallery_images : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLand();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOverviewChange = (index, field, value) => {
    setFormData((prev) => {
      const nextOverview = [...prev.overview];
      nextOverview[index] = { ...nextOverview[index], [field]: value };
      return { ...prev, overview: nextOverview };
    });
  };

  const addOverview = () => {
    setFormData((prev) => ({
      ...prev,
      overview: [...prev.overview, { title: overviewOptions[0]?.value || '', value: '' }],
    }));
  };

  const removeOverview = (index) => {
    setFormData((prev) => ({
      ...prev,
      overview: prev.overview.filter((_, idx) => idx !== index),
    }));
  };

  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleMainVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainVideoFile(file);
    setMainVideoPreview(URL.createObjectURL(file));
  };

  const handleGalleryFiles = (files) => {
    const incoming = Array.from(files).filter((file) => file.type.startsWith('image/'));
    const newImages = incoming.map((file) => ({ id: `${file.name}-${Date.now()}`, file, preview: URL.createObjectURL(file) }));
    setNewGalleryImages((prev) => [...prev, ...newImages]);
  };

  const handleGalleryChange = (e) => {
    if (e.target.files?.length > 0) {
      handleGalleryFiles(e.target.files);
    }
    e.target.value = null;
  };

  const handleGalleryDrop = (e) => {
    e.preventDefault();
    setGalleryDragActive(false);
    if (e.dataTransfer.files?.length > 0) {
      handleGalleryFiles(e.dataTransfer.files);
    }
  };

  const removeNewGalleryImage = (id) => {
    setNewGalleryImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('land_size', formData.land_size);
      data.append('size_unit', formData.size_unit);
      data.append('duration', formData.duration);
      data.append('location', formData.location);
      data.append('city', formData.city);
      data.append('overview', JSON.stringify(formData.overview));

      if (mainImageFile) data.append('main_image', mainImageFile);
      if (mainVideoFile) data.append('main_video', mainVideoFile);
      newGalleryImages.forEach((img) => data.append('images', img.file));

      await API.put(`/api/lands/edit/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate(`/dashboard/lands/profile/${id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mt-8 mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-[#14213D] mb-5">Edit Land</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Land title"
            className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price (RS)"
            className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
          />
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description here..."
          rows={4}
          className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
            className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FCA311]"
          />

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location address"
            className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="number"
            name="land_size"
            step="0.01"
            value={formData.land_size}
            onChange={handleChange}
            placeholder="Land size"
            className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
          />

          <select
            name="size_unit"
            value={formData.size_unit}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FCA311]"
          >
            <option value="perches">Perches</option>
            <option value="acres">Acres</option>
            <option value="sqft">Sqft</option>
          </select>

          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FCA311]"
          >
            <option value="permanent">Permanent</option>
            <option value="year">Year</option>
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
        </div>

        <div className="space-y-3 border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-lg text-[#14213D]">Overview</h3>
          <p className="text-xs text-gray-500">Choose a title from the list and enter only the value.</p>

          {formData.overview.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <select
                value={item.title}
                onChange={(e) => handleOverviewChange(index, 'title', e.target.value)}
                className="border border-gray-300 p-3 rounded-xl text-sm w-full sm:w-1/2"
              >
                {overviewOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Enter value"
                value={item.value}
                onChange={(e) => handleOverviewChange(index, 'value', e.target.value)}
                className="border border-gray-300 p-3 rounded-xl text-sm w-full sm:w-1/2"
              />

              <button
                type="button"
                onClick={() => removeOverview(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm shrink-0"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addOverview}
            className="bg-[#FCA311] px-4 py-2 rounded-xl text-sm font-medium w-full sm:w-auto"
          >
            + Add Overview
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#14213D]">Main Image</label>
            <div
              onClick={() => document.getElementById('landEditMainImageInput').click()}
              className="relative w-full h-44 sm:h-56 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-colors border-gray-300 hover:border-[#FCA311]"
            >
              {!mainImagePreview ? (
                <>
                  <Upload className="w-7 h-7 text-[#FCA311] mb-2" />
                  <span className="text-gray-600 text-sm font-medium">Tap to upload main image</span>
                  <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</span>
                </>
              ) : (
                <>
                  <img src={mainImagePreview} alt="main preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMainImageFile(null); setMainImagePreview(null); }}
                    className="absolute top-2 right-2 bg-[#14213D]/80 text-white rounded-full p-1.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
              <input id="landEditMainImageInput" type="file" accept="image/*" onChange={handleMainImage} className="hidden" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#14213D]">Main Video</label>
            <div
              onClick={() => document.getElementById('landEditMainVideoInput').click()}
              className="relative w-full h-44 sm:h-56 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-colors border-gray-300 hover:border-[#FCA311]"
            >
              {!mainVideoPreview ? (
                <>
                  <Upload className="w-7 h-7 text-[#FCA311] mb-2" />
                  <span className="text-gray-600 text-sm font-medium">Tap to upload main video (optional)</span>
                  <span className="text-xs text-gray-400 mt-1">MP4</span>
                </>
              ) : (
                <>
                  <video src={mainVideoPreview} controls className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMainVideoFile(null); setMainVideoPreview(null); }}
                    className="absolute top-2 right-2 bg-[#14213D]/80 text-white rounded-full p-1.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
              <input id="landEditMainVideoInput" type="file" accept="video/*" onChange={handleMainVideo} className="hidden" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#14213D]">Gallery Images</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setGalleryDragActive(true); }}
            onDragLeave={() => setGalleryDragActive(false)}
            onDrop={handleGalleryDrop}
            onClick={() => document.getElementById('landEditGalleryInput').click()}
            className={`flex flex-col items-center justify-center gap-1.5 border-2 border-dashed rounded-xl p-5 sm:p-6 cursor-pointer transition-colors ${galleryDragActive ? 'border-[#FCA311] bg-orange-50' : 'border-gray-300 hover:border-[#FCA311]'}`}
          >
            <Upload className="w-6 h-6 text-[#FCA311]" />
            <p className="text-sm text-gray-600 font-medium text-center">Tap to upload, or drag & drop images here</p>
            <p className="text-xs text-gray-400">JPG, PNG, WEBP — add new images</p>
            <input
              id="landEditGalleryInput"
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryChange}
              className="hidden"
            />
          </div>

          {(existingGalleryImages.length > 0 || newGalleryImages.length > 0) && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-3">
              {existingGalleryImages.map((img, idx) => (
                <div key={`existing-${idx}`} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                  <img src={img} alt={`existing-${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
              {newGalleryImages.map((img) => (
                <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                  <img src={img.preview} alt={`new-${img.id}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewGalleryImage(img.id)}
                    className="absolute top-1 right-1 bg-[#14213D]/80 text-white rounded-full p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div
                onClick={() => document.getElementById('landEditGalleryInput').click()}
                className="flex items-center justify-center aspect-square rounded-xl border border-dashed border-gray-300 text-[#FCA311] cursor-pointer hover:border-[#FCA311]"
              >
                <ImagePlus className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white pt-3 pb-1 -mx-4 px-4 flex justify-center sm:static sm:bg-transparent sm:mx-0 sm:px-0">
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#14213D] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#1c2c52] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLandsProfile;
