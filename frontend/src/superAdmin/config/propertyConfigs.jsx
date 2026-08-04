const commonFields = [
  { name: 'client_id', label: 'Client ID', required: true, help: 'Numeric id of the listing owner' },
  { name: 'title', label: 'Title', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'price', label: 'Price (Rs)', type: 'number', required: true },
  { name: 'property_type', label: 'Property type', required: true, help: 'e.g. house, apartment, villa' },
  { name: 'city', label: 'City', required: true },
  { name: 'Location', label: 'Location', required: true },
  { name: 'map_address', label: 'Map address' },
  { name: 'area_sqft', label: 'Area (sqft)', type: 'number' },
  { name: 'main_image', label: 'Main image URL', required: true }
];

export const propertyConfigs = {
  'hot-sales': {
    slug: 'hot-sales',
    title: 'Hot Sales',
    basePath: '/properties/hot-sales',
    statuses: ['pending', 'active', 'sold'],
    fields: commonFields,
    columns: [
      { key: 'title', label: 'Title', cell: (r) => <div><div className="font-medium text-teal-deep">{r.title}</div><div className="text-[11.5px] text-ink-soft">{r.property_type}</div></div> },
      { key: 'city', label: 'City' },
      { key: 'price', label: 'Price', cell: (r) => <span className="font-mono text-[12.5px]">Rs {Number(r.price).toLocaleString()}</span> }
    ]
  },
  'stays-to-buy': {
    slug: 'stays-to-buy',
    title: 'Stays to Buy',
    basePath: '/properties/stays-to-buy',
    statuses: ['pending', 'active', 'sold'],
    fields: commonFields,
    columns: [
      { key: 'title', label: 'Title', cell: (r) => <div><div className="font-medium text-teal-deep">{r.title}</div><div className="text-[11.5px] text-ink-soft">{r.property_type}</div></div> },
      { key: 'city', label: 'City' },
      { key: 'price', label: 'Price', cell: (r) => <span className="font-mono text-[12.5px]">Rs {Number(r.price).toLocaleString()}</span> }
    ]
  },
  'stays-to-rent': {
    slug: 'stays-to-rent',
    title: 'Stays to Rent',
    basePath: '/properties/stays-to-rent',
    statuses: ['pending', 'active', 'rented'],
    fields: [...commonFields, { name: 'price_period', label: 'Price period', type: 'select', options: ['monthly', 'yearly'] }],
    columns: [
      { key: 'title', label: 'Title', cell: (r) => <div><div className="font-medium text-teal-deep">{r.title}</div><div className="text-[11.5px] text-ink-soft">{r.property_type}</div></div> },
      { key: 'city', label: 'City' },
      { key: 'price', label: 'Price', cell: (r) => <span className="font-mono text-[12.5px]">Rs {Number(r.price).toLocaleString()} / {r.price_period}</span> }
    ]
  },
  land: {
    slug: 'land',
    title: 'Land',
    basePath: '/properties/land',
    statuses: ['pending', 'active', 'sold'],
    fields: [
      { name: 'client_id', label: 'Client ID', required: true },
      { name: 'title', label: 'Title', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'price', label: 'Price (Rs)', type: 'number', required: true },
      { name: 'land_size', label: 'Land size', type: 'number', required: true },
      { name: 'size_unit', label: 'Size unit', type: 'select', options: ['perches', 'acres', 'sqft'] },
      { name: 'city', label: 'City', required: true },
      { name: 'Location', label: 'Location' },
      { name: 'main_image', label: 'Main image URL', required: true }
    ],
    columns: [
      { key: 'title', label: 'Title', cell: (r) => <div><div className="font-medium text-teal-deep">{r.title}</div><div className="text-[11.5px] text-ink-soft">{r.land_size} {r.size_unit}</div></div> },
      { key: 'city', label: 'City' },
      { key: 'price', label: 'Price', cell: (r) => <span className="font-mono text-[12.5px]">Rs {Number(r.price).toLocaleString()}</span> }
    ]
  },
  wanted: {
    slug: 'wanted',
    title: 'Wanted',
    basePath: '/properties/wanted',
    statuses: ['pending', 'active', 'closed'],
    fields: [
      { name: 'client_id', label: 'Client ID', required: true },
      { name: 'title', label: 'Title', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'budget', label: 'Budget (Rs)', type: 'number' },
      { name: 'preferred_city', label: 'Preferred city' },
      { name: 'phone_number', label: 'Phone number', required: true },
      { name: 'main_image', label: 'Main image URL' }
    ],
    columns: [
      { key: 'title', label: 'Title', cell: (r) => <div><div className="font-medium text-teal-deep">{r.title}</div><div className="text-[11.5px] text-ink-soft">{r.preferred_city || 'any city'}</div></div> },
      { key: 'phone', label: 'Phone', cell: (r) => <span className="font-mono text-[12.5px]">{r.phone_number || '—'}</span> },
      { key: 'budget', label: 'Budget', cell: (r) => <span className="font-mono text-[12.5px]">{r.budget ? `Rs ${Number(r.budget).toLocaleString()}` : '—'}</span> }
    ]
  }
};
