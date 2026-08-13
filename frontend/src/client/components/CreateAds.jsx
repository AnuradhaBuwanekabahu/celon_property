import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, X, Megaphone, Link2, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../api/clientapi.js';

const CreateAds = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    client_id: '',
    title: '',
    link_url: '',
    position: 'front_page_top',
    is_active: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedClient = localStorage.getItem('client');

    if (storedClient && storedClient !== 'undefined') {
      try {
        const parsed = JSON.parse(storedClient);
        const clientId = parsed?.id ?? parsed?.clientId ?? parsed?.client_id ?? id ?? '';
        setFormData((prev) => ({ ...prev, client_id: clientId }));
      } catch {
        setFormData((prev) => ({ ...prev, client_id: id ?? '' }));
      }
    } else {
      setFormData((prev) => ({ ...prev, client_id: id ?? '' }));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter an advertisement title');
      return;
    }

    if (!formData.client_id) {
      toast.error('Client information is missing. Please log in again.');
      return;
    }

    if (!imageFile) {
      toast.error('Please upload an advertisement image');
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append('client_id', formData.client_id);
      data.append('title', formData.title);
      data.append('link_url', formData.link_url || '');
      data.append('position', formData.position || 'sub_pages');
      data.append('is_active', formData.is_active ? '1' : '0');
      data.append('image', imageFile);

      await API.post('/api/ads/add', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Advertisement created successfully');
      setFormData({
        client_id: formData.client_id,
        title: '',
        link_url: '',
        position: 'front_page_top',
        is_active: true,
      });
      setImageFile(null);
      setImagePreview('');
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to create advertisement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-3 py-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      

        <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-6 lg:p-8">
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-[#FCA311]" />
              <h3 className="text-base font-semibold text-[#14213D]">Ad details</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="font-medium text-slate-700">Ad title</span>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Summer special offer"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#FCA311] focus:ring-2 focus:ring-orange-100"
                />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium text-slate-700">Ad location</span>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#FCA311] focus:ring-2 focus:ring-orange-100"
                >
                  <option value="front_page_top">Front page top</option>
                  <option value="front_page_bottom">Front page bottom</option>
                  <option value="sub_pages">Sub pages</option>
                </select>
              </label>
            </div>

            <label className="mt-4 block space-y-2 text-sm">
              <span className="font-medium text-slate-700">Link URL</span>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-3">
                <Link2 className="h-4 w-4 text-slate-400" />
                <input
                  type="url"
                  name="link_url"
                  value={formData.link_url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </label>

            <label className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm">
              <span className="font-medium text-slate-700">Active ad</span>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className={`rounded-full p-1 ${formData.is_active ? 'bg-[#FCA311]' : 'bg-slate-300'}`}>
                  {formData.is_active ? <ToggleRight className="h-5 w-5 text-white" /> : <ToggleLeft className="h-5 w-5 text-white" />}
                </span>
              </div>
            </label>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <Upload className="h-5 w-5 text-[#FCA311]" />
              <h3 className="text-base font-semibold text-[#14213D]">Ad image</h3>
            </div>
            <p className="mb-4 text-sm text-slate-500">Upload a single image for the advertisement banner.</p>

            <div
              onClick={() => document.getElementById('adImageInput').click()}
              className={`relative flex h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition ${
                imagePreview ? 'border-[#FCA311] bg-orange-50' : 'border-slate-300 hover:border-[#FCA311]'
              }`}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Ad preview" className="h-full w-full rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-2 top-2 rounded-full bg-[#14213D]/80 p-1.5 text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <Upload className="mb-2 h-8 w-8 text-[#FCA311]" />
                  <p className="text-sm font-medium text-slate-700">Tap to upload the ad image</p>
                  <p className="text-xs text-slate-500">PNG, JPG, WEBP</p>
                </>
              )}
              <input id="adImageInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
          </section>

          <div className="sticky bottom-0 z-10 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-none sm:bg-transparent sm:px-0 sm:py-0">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#14213D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d2f57] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-8"
            >
              {loading ? 'Creating ad...' : 'Create advertisement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAds;
