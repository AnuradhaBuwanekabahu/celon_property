import { useState, useCallback } from 'react';
import { Upload, X, ImagePlus } from 'lucide-react';
import { overviewOptions, highlightOptions, cityOptions } from '../lib/propertyData';

const PROPERTY_TYPES = ['House', 'Apartment', 'Bungalow', 'Hotel', 'WareHouse', 'Villa', 'Studio'];
const MAX_GALLERY = 9;

// ─── Drag & Drop Upload Zone ──────────────────────────────────────────────────
function UploadZone({ accept, preview, label, hint, onFile, onRemove, isVideo }) {
  const [drag, setDrag] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const id = `upload-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-800">{label}</label>
      <div
        className={`relative w-full h-44 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors
          ${drag ? 'border-amber-500 bg-amber-50' : 'border-slate-300 hover:border-amber-400'}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => !preview && document.getElementById(id).click()}
      >
        {!preview ? (
          <div className="flex flex-col items-center gap-1.5 pointer-events-none">
            <Upload className="w-7 h-7 text-amber-500" />
            <span className="text-slate-600 text-sm font-medium">{hint}</span>
          </div>
        ) : isVideo ? (
          <>
            <video src={preview} controls className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="absolute top-2 right-2 bg-slate-900/70 text-white rounded-full p-1.5"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <img src={preview} alt="preview" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="absolute top-2 right-2 bg-slate-900/70 text-white rounded-full p-1.5"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}
        <input
          id={id}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => { if (e.target.files[0]) onFile(e.target.files[0]); e.target.value = ''; }}
        />
      </div>
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({ title, subtitle, children }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
      <div>
        <h3 className="font-semibold text-[#14213D] text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── Main PropertyForm ────────────────────────────────────────────────────────
export default function PropertyForm({ initialValues = {}, onSave, saving, statuses = [], showRentPeriod = false, onClose }) {

  // ── form text state
  const [form, setForm] = useState({
    client_id:     initialValues.client_id     || '',
    title:         initialValues.title         || '',
    price:         initialValues.price         || '',
    description:   initialValues.description   || '',
    property_type: initialValues.property_type || '',
    city:          initialValues.city          || '',
    duration:      initialValues.duration      || 'month',
    area_sqft:     initialValues.area_sqft     || '',
    map_address:   initialValues.map_address   || '',
    location:      initialValues.location      || '',
    status:        initialValues.status        || 'pending',
    price_period:  initialValues.price_period  || 'monthly',
  });

  const [overview, setOverview] = useState(() => {
    const raw = initialValues.overview;
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') { try { return JSON.parse(raw); } catch { return []; } }
    return [{ title: 'Bedrooms', value: '' }];
  });

  const [highlights, setHighlights] = useState(() => {
    const raw = initialValues.highlights;
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') { try { return JSON.parse(raw); } catch { return []; } }
    return [];
  });

  // ── image / video state
  const [mainImage, setMainImage]     = useState(null);
  const [mainImgPrev, setMainImgPrev] = useState(initialValues.main_image || null);
  const [mainVideo, setMainVideo]     = useState(null);
  const [mainVidPrev, setMainVidPrev] = useState(initialValues.main_video || null);
  const [gallery, setGallery]         = useState(() => {
    const existing = initialValues.gallery_images || initialValues.images || [];
    if (!Array.isArray(existing)) return [];
    return existing.map((img, i) => ({
      id: `ex-${i}`,
      file: null,
      preview: typeof img === 'string' ? img : (img?.url || ''),
      isExisting: true,
    }));
  });
  const [galleryDrag, setGalleryDrag] = useState(false);

  // ── handlers
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const addOverviewRow = () => {
    const used = overview.map(o => o.title);
    const next = overviewOptions.find(o => !used.includes(o.value))?.value || overviewOptions[0].value;
    setOverview(p => [...p, { title: next, value: '' }]);
  };
  const removeOverviewRow = (i) => setOverview(p => p.filter((_, idx) => idx !== i));
  const changeOverview = (i, field, val) => {
    setOverview(p => { const c = [...p]; c[i] = { ...c[i], [field]: val }; return c; });
  };
  const toggleHighlight = (h) => {
    setHighlights(p => p.includes(h) ? p.filter(x => x !== h) : [...p, h]);
  };

  const addGalleryFiles = useCallback((files) => {
    const remaining = MAX_GALLERY - gallery.length;
    const toAdd = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .slice(0, remaining)
      .map(f => ({ id: `${f.name}-${Date.now()}-${Math.random()}`, file: f, preview: URL.createObjectURL(f), isExisting: false }));
    setGallery(p => [...p, ...toAdd]);
  }, [gallery.length]);

  const removeGallery = (id) => {
    setGallery(p => {
      const t = p.find(i => i.id === id);
      if (t && !t.isExisting) URL.revokeObjectURL(t.preview);
      return p.filter(i => i.id !== id);
    });
  };

  // ── submit
  const handleSave = () => {
    const fd = new FormData();

    // text fields
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('overview',   JSON.stringify(overview));
    fd.append('highlights', JSON.stringify(highlights));

    // files
    if (mainImage) fd.append('main_image', mainImage);
    if (mainVideo) fd.append('main_video', mainVideo);
    gallery.filter(g => !g.isExisting && g.file).forEach(g => fd.append('images', g.file));

    onSave(fd);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Client ID */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-widest block mb-1.5">Client ID <span className="text-slate-400 font-normal normal-case tracking-normal">(optional)</span></label>
        <input
          type="text"
          value={form.client_id}
          onChange={e => setF('client_id', e.target.value)}
          placeholder="Leave blank to use first available client"
          className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition"
        />
      </div>

      {/* Title + Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-widest block mb-1.5">Title <span className="text-rose-500">*</span></label>
          <input
            type="text"
            value={form.title}
            onChange={e => setF('title', e.target.value)}
            placeholder="Property title"
            className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition"
          />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-widest block mb-1.5">Price (Rs) <span className="text-rose-500">*</span></label>
          <input
            type="number"
            value={form.price}
            onChange={e => setF('price', e.target.value)}
            placeholder="Price (RS)"
            className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition"
          />
        </div>
      </div>

      {/* Description */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-widest block mb-1.5">Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={e => setF('description', e.target.value)}
          placeholder="Enter description here..."
          className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition resize-none"
        />
      </div>

      {/* Property Type + City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-widest block mb-1.5">Property Type</label>
          <select
            value={form.property_type}
            onChange={e => setF('property_type', e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition cursor-pointer"
          >
            <option value="">Select property type</option>
            {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-widest block mb-1.5">City</label>
          <select
            value={form.city}
            onChange={e => setF('city', e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition cursor-pointer"
          >
            <option value="">Select City</option>
            {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Duration + Rent Period (conditional) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-widest block mb-1.5">Duration</label>
          <select
            value={form.duration}
            onChange={e => setF('duration', e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition cursor-pointer"
          >
            <option value="year">Year</option>
            <option value="month">Month</option>
            <option value="day">Day</option>
          </select>
        </div>
        {showRentPeriod && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-widest block mb-1.5">Rent Period</label>
            <select
              value={form.price_period}
              onChange={e => setF('price_period', e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition cursor-pointer"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}
        {statuses.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-widest block mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={e => setF('status', e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition cursor-pointer"
            >
              {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Overview */}
      <Section title="Overview" subtitle="Choose a title from the list and enter only the value.">
        {overview.map((item, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-2">
            <select
              value={item.title}
              onChange={e => changeOverview(i, 'title', e.target.value)}
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition cursor-pointer"
            >
              {overviewOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <input
              type="text"
              placeholder="Enter value"
              value={item.value}
              onChange={e => changeOverview(i, 'value', e.target.value)}
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition"
            />
            <button
              type="button"
              onClick={() => removeOverviewRow(i)}
              className="px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition shrink-0"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addOverviewRow}
          className="px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition"
        >
          + Add Overview
        </button>
      </Section>

      {/* Highlights */}
      <Section title="Highlights" subtitle="Select property highlights">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {highlightOptions.map(h => (
            <label
              key={h}
              className={`flex items-center gap-2 border px-2.5 py-2 rounded-xl text-xs cursor-pointer transition
                ${highlights.includes(h)
                  ? 'border-amber-400 bg-amber-50 text-amber-800 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
            >
              <input
                type="checkbox"
                checked={highlights.includes(h)}
                onChange={() => toggleHighlight(h)}
                className="accent-amber-500 w-3.5 h-3.5 shrink-0"
              />
              {h}
            </label>
          ))}
        </div>
      </Section>

      {/* Area + Map + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-widest block mb-1.5">Area (sqft)</label>
          <input
            type="number"
            value={form.area_sqft}
            onChange={e => setF('area_sqft', e.target.value)}
            placeholder="Area (sqft)"
            className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition"
          />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-widest block mb-1.5">Map Address</label>
          <input
            type="text"
            value={form.map_address}
            onChange={e => setF('map_address', e.target.value)}
            placeholder="Enter your map address"
            className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition"
          />
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-widest block mb-1.5">Location Address</label>
        <input
          type="text"
          value={form.location}
          onChange={e => setF('location', e.target.value)}
          placeholder="Enter your location address"
          className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition"
        />
      </div>

      {/* Main Image + Video */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <UploadZone
          label="Main Image"
          hint="Tap to upload main image — JPG, PNG, WEBP"
          accept="image/*"
          preview={mainImgPrev}
          onFile={(f) => { setMainImage(f); setMainImgPrev(URL.createObjectURL(f)); }}
          onRemove={() => { setMainImage(null); setMainImgPrev(null); }}
        />
        <UploadZone
          label="Main Video (optional)"
          hint="Tap to upload main video — MP4"
          accept="video/*"
          isVideo
          preview={mainVidPrev}
          onFile={(f) => { setMainVideo(f); setMainVidPrev(URL.createObjectURL(f)); }}
          onRemove={() => { setMainVideo(null); setMainVidPrev(null); }}
        />
      </div>

      {/* Gallery Images */}
      <Section title={`Gallery Images (${gallery.length}/${MAX_GALLERY})`} subtitle="Up to 9 images — JPG, PNG, WEBP">
        <div
          className={`flex flex-col items-center justify-center gap-1.5 border-2 border-dashed rounded-xl p-5 cursor-pointer transition-colors
            ${galleryDrag ? 'border-amber-500 bg-amber-50' : 'border-slate-300 hover:border-amber-400'}
            ${gallery.length >= MAX_GALLERY ? 'opacity-50 pointer-events-none' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setGalleryDrag(true); }}
          onDragLeave={() => setGalleryDrag(false)}
          onDrop={(e) => { e.preventDefault(); setGalleryDrag(false); addGalleryFiles(e.dataTransfer.files); }}
          onClick={() => gallery.length < MAX_GALLERY && document.getElementById('gallery-upload').click()}
        >
          <Upload className="w-6 h-6 text-amber-500" />
          <p className="text-sm text-slate-600 font-medium text-center">Tap to upload, or drag & drop images here</p>
          <p className="text-xs text-slate-400">JPG, PNG, WEBP — up to {MAX_GALLERY} images</p>
          <input
            id="gallery-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => { addGalleryFiles(e.target.files); e.target.value = ''; }}
          />
        </div>

        {gallery.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mt-2">
            {gallery.map(img => (
              <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200">
                <img src={img.preview} alt="gallery" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeGallery(img.id)}
                  className="absolute top-1 right-1 bg-slate-900/70 text-white rounded-full p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {gallery.length < MAX_GALLERY && (
              <div
                onClick={() => document.getElementById('gallery-upload').click()}
                className="flex items-center justify-center aspect-square rounded-xl border border-dashed border-slate-300 text-amber-500 cursor-pointer hover:border-amber-400"
              >
                <ImagePlus className="w-5 h-5" />
              </div>
            )}
          </div>
        )}
      </Section>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 text-sm font-semibold text-white bg-[#14213D] rounded-xl hover:bg-[#1c2c52] disabled:opacity-50 transition"
        >
          {saving ? 'Saving…' : 'Save listing'}
        </button>
      </div>
    </div>
  );
}
