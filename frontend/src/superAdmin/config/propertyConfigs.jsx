export { getDisplayImage } from '../lib/imageUtils.js';

const ClientBadge = ({ id }) => {
  const displayId = id !== undefined && id !== null && id !== '' ? id : '—';
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded-md">
      Client #{displayId}
    </span>
  );
};

const commonFields = [
  { name: 'client_id', label: 'Client ID', required: false, help: 'Optional — defaults to active client if left blank' },
  { name: 'title', label: 'Title', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'price', label: 'Price (Rs)', type: 'number', required: true },
  { name: 'property_type', label: 'Property type', required: true, help: 'e.g. House, Apartment, Villa, Commercial' },
  { name: 'city', label: 'City', required: true },
  { name: 'location', label: 'Location / Address' },
  { name: 'map_address', label: 'Map address' },
  { name: 'area_sqft', label: 'Area (sqft)', type: 'number' },
  { name: 'main_image', label: 'Main Image (URL or Upload)', type: 'image', required: true }
];

export const propertyConfigs = {
  'hot-sales': {
    slug: 'hot-sales',
    title: 'Hot Sales',
    basePath: '/properties/hot-sales',
    richForm: true,
    statuses: ['pending', 'active', 'approved', 'rejected', 'sold'],
    fields: [...commonFields, { name: 'images', label: 'Extra Images (comma‑separated URLs)', type: 'textarea', help: 'Enter URLs separated by commas' }],
    columns: [
      { key: 'client_id', label: 'Client ID', cell: (r) => <ClientBadge id={r.client_id || r.client_Id} /> },
      { key: 'title', label: 'Title & Type', cell: (r) => <div><div className="font-semibold text-slate-900">{r.title}</div><div className="text-xs text-slate-500 font-medium">{r.property_type || 'Hot Sale'}</div></div> },
      { key: 'city', label: 'Location', cell: (r) => <div><div className="font-medium text-slate-800">{r.city}</div><div className="text-xs text-slate-400">{r.location || r.map_address || '—'}</div></div> },
      { key: 'price', label: 'Price', cell: (r) => <span className="font-mono font-semibold text-slate-900">Rs {Number(r.price || 0).toLocaleString()}</span> }
    ]
  },
  'stays-to-buy': {
    slug: 'stays-to-buy',
    title: 'Stays to Buy',
    basePath: '/properties/stays-to-buy',
    richForm: true,
    statuses: ['pending', 'active', 'sold'],
    fields: [...commonFields, { name: 'images', label: 'Extra Images (comma‑separated URLs)', type: 'textarea', help: 'Enter URLs separated by commas' }],
    columns: [
      { key: 'client_id', label: 'Client ID', cell: (r) => <ClientBadge id={r.client_id || r.client_Id} /> },
      { key: 'title', label: 'Title & Type', cell: (r) => <div><div className="font-semibold text-slate-900">{r.title}</div><div className="text-xs text-slate-500 font-medium">{r.property_type || 'Stay to Buy'}</div></div> },
      { key: 'city', label: 'Location', cell: (r) => <div><div className="font-medium text-slate-800">{r.city}</div><div className="text-xs text-slate-400">{r.location || r.map_address || '—'}</div></div> },
      { key: 'price', label: 'Price', cell: (r) => <span className="font-mono font-semibold text-slate-900">Rs {Number(r.price || 0).toLocaleString()}</span> }
    ]
  },
  'stays-to-rent': {
    slug: 'stays-to-rent',
    title: 'Stays to Rent',
    basePath: '/properties/stays-to-rent',
    richForm: true,
    statuses: ['pending', 'active', 'rented'],
    fields: [...commonFields, { name: 'price_period', label: 'Price period', type: 'select', options: ['monthly', 'yearly'] }, { name: 'images', label: 'Extra Images (comma‑separated URLs)', type: 'textarea', help: 'Enter URLs separated by commas' }],
    columns: [
      { key: 'client_id', label: 'Client ID', cell: (r) => <ClientBadge id={r.client_id || r.client_Id} /> },
      { key: 'title', label: 'Title & Type', cell: (r) => <div><div className="font-semibold text-slate-900">{r.title}</div><div className="text-xs text-slate-500 font-medium">{r.property_type || 'Stay to Rent'}</div></div> },
      { key: 'city', label: 'Location', cell: (r) => <div><div className="font-medium text-slate-800">{r.city}</div><div className="text-xs text-slate-400">{r.location || r.map_address || '—'}</div></div> },
      { key: 'price', label: 'Price', cell: (r) => <span className="font-mono font-semibold text-slate-900">Rs {Number(r.price || 0).toLocaleString()} {r.price_period ? `/ ${r.price_period}` : ''}</span> }
    ]
  },
  land: {
    slug: 'land',
    title: 'Land',
    basePath: '/properties/land',
    statuses: ['pending', 'active', 'sold'],
    fields: [
      { name: 'client_id', label: 'Client ID', required: false, help: 'Optional — defaults to active client if left blank' },
      { name: 'title', label: 'Title', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'price', label: 'Price (Rs)', type: 'number', required: true },
      { name: 'land_size', label: 'Land size', type: 'number', required: true },
      { name: 'size_unit', label: 'Size unit', type: 'select', options: ['perches', 'acres', 'sqft'] },
      { name: 'city', label: 'City', required: true },
      { name: 'location', label: 'Location' },
      { name: 'main_image', label: 'Main Image (URL or Upload)', type: 'image', required: true },
      { name: 'images', label: 'Extra Images (comma‑separated URLs)', type: 'textarea', help: 'Enter URLs separated by commas' }
    ],
    columns: [
      { key: 'client_id', label: 'Client ID', cell: (r) => <ClientBadge id={r.client_id || r.client_Id} /> },
      { key: 'title', label: 'Title & Size', cell: (r) => <div><div className="font-semibold text-slate-900">{r.title}</div><div className="text-xs text-slate-500 font-medium">{r.land_size} {r.size_unit || 'perches'}</div></div> },
      { key: 'city', label: 'Location', cell: (r) => <div><div className="font-medium text-slate-800">{r.city}</div><div className="text-xs text-slate-400">{r.location || '—'}</div></div> },
      { key: 'price', label: 'Price', cell: (r) => <span className="font-mono font-semibold text-slate-900">Rs {Number(r.price || 0).toLocaleString()}</span> }
    ]
  },
  wanted: {
    slug: 'wanted',
    title: 'Wanted',
    basePath: '/properties/wanted',
    statuses: ['pending', 'active', 'closed'],
    fields: [
      { name: 'client_id', label: 'Client ID', required: false, help: 'Optional — defaults to active client if left blank' },
      { name: 'title', label: 'Title', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'budget', label: 'Budget (Rs)', type: 'number' },
      { name: 'preferred_city', label: 'Preferred city' },
      { name: 'phone_number', label: 'Phone number', required: true },
      { name: 'main_image', label: 'Main Image (URL or Upload)', type: 'image' },
      { name: 'images', label: 'Extra Images (comma‑separated URLs)', type: 'textarea', help: 'Enter URLs separated by commas' }
    ],
    columns: [
      { key: 'client_id', label: 'Client ID', cell: (r) => <ClientBadge id={r.client_id || r.client_Id} /> },
      { key: 'title', label: 'Title', cell: (r) => <div><div className="font-semibold text-slate-900">{r.title}</div><div className="text-xs text-slate-500 font-medium">City: {r.preferred_city || 'Any'}</div></div> },
      { key: 'phone', label: 'Phone', cell: (r) => <span className="font-mono text-slate-800">{r.phone_number || '—'}</span> },
      { key: 'budget', label: 'Budget', cell: (r) => <span className="font-mono font-semibold text-slate-900">{r.budget ? `Rs ${Number(r.budget).toLocaleString()}` : '—'}</span> }
    ]
  }
};
