import { createContext, useState ,useCallback} from "react";
import API from "../api/clientapi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { overviewOptions } from "../Assets/data.js";
export const clientContext = createContext();

export function ClientProvider({ children }) {
  const [hotSales, setHotSales] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stayToBuy, setStayToBuy] = useState([]);
  const [staytoBuySelectedProperty, setStayToBuySelectedProperty] = useState(null);
  const [stayToRent, setStayToRent] = useState([]);



   const navigate = useNavigate();
const MAX_GALLERY_IMAGES = 9;
    // expose limit to consumers
  
      const [formData, setFormData] = useState({
          title: '',
          description: '',
          price: '',
          property_type: '',
          duration: 'month',
          rate: '',
          overview: [{ title: 'Bedrooms', value: '' }],
          highlights: [],
          area_sqft: '',
          city: '',
          map_address: '',
          location: '',
      });
  
      const [mainImage, setMainImage] = useState(null);
      const [mainImagePreview, setMainImagePreview] = useState(null);
      const [mainDragActive, setMainDragActive] = useState(false);
      const [mainVideo, setMainVideo] = useState(null);
      const [mainVideoPreview, setMainVideoPreview] = useState(null);
  
      const [galleryImages, setGalleryImages] = useState([]); // [{file, preview, id}]
      const [galleryDragActive, setGalleryDragActive] = useState(false);
  
      const setMainFile = (file) => {
          if (file && file.type.startsWith('image/')) {
              setMainImage(file);
              setMainImagePreview(URL.createObjectURL(file));
          } else if (file && file.type.startsWith('video/')) {
              setMainVideo(file);
              setMainVideoPreview(URL.createObjectURL(file));
          }
      };
  
      const handleMainImage = (e) => {
          setMainFile(e.target.files[0]);
      };
  
      const handleMainVideo = (e) => {
          const file = e.target.files[0];
          if (file && file.type.startsWith('video/')) {
              setMainVideo(file);
              setMainVideoPreview(URL.createObjectURL(file));
          }
      };
  
      const handleMainDrop = (e) => {
          e.preventDefault();
          setMainDragActive(false);
          setMainFile(e.dataTransfer.files[0]);
      };
  
      const removeMainImage = (e) => {
          e.preventDefault();
          e.stopPropagation();
          setMainImage(null);
          setMainImagePreview(null);
      };
  
      const addGalleryFiles = (fileList) => {
          const incoming = Array.from(fileList).filter((file) => file.type.startsWith('image/'));
          const remainingSlots = MAX_GALLERY_IMAGES - galleryImages.length;
          const filesToAdd = incoming.slice(0, remainingSlots);
  
          const newImages = filesToAdd.map((file) => ({
              file,
              preview: URL.createObjectURL(file),
              id: `${file.name}-${Date.now()}-${Math.random()}`,
          }));
  
          setGalleryImages((prev) => [...prev, ...newImages]);
      };
  
      const handleImages = (e) => {
          addGalleryFiles(e.target.files);
          e.target.value = null;
      };
  
      const handleGalleryDrop = (e) => {
          e.preventDefault();
          setGalleryDragActive(false);
          addGalleryFiles(e.dataTransfer.files);
      };
  
      const removeGalleryImage = (e, id) => {
          e.preventDefault();
          e.stopPropagation();
          setGalleryImages((prev) => {
              const target = prev.find((img) => img.id === id);
              if (target) URL.revokeObjectURL(target.preview);
              return prev.filter((img) => img.id !== id);
          });
      };
  
      const handleHighlightChange = (highlight) => {
          setFormData((prev) => ({
              ...prev,
              highlights: prev.highlights.includes(highlight)
                  ? prev.highlights.filter((item) => item !== highlight)
                  : [...prev.highlights, highlight],
          }));
      };
  
      const handleOverviewChange = (index, field, value) => {
          const updatedOverview = [...formData.overview];
          updatedOverview[index][field] = value;
          setFormData({ ...formData, overview: updatedOverview });
      };

      const addOverview = () => {
          const usedTitles = formData.overview.map((item) => item.title);
          const nextTitle = overviewOptions.find((option) => !usedTitles.includes(option.value))?.value || overviewOptions[0].value;

          setFormData({
              ...formData,
              overview: [...formData.overview, { title: nextTitle, value: '' }],
          });
      };

      const removeOverview = (index) => {
          const updatedOverview = formData.overview.filter((_, i) => i !== index);
          if (updatedOverview.length > 0) {
              setFormData({ ...formData, overview: updatedOverview });
          }
      };

      const handleChange = (e) => {
          setFormData({
              ...formData,
              [e.target.name]: e.target.value,
          });
      };

      const handleSubmit = async (e) => {
          e.preventDefault();

          let client = null;
          const storedClient = localStorage.getItem('client');

          if (storedClient && storedClient !== 'undefined') {
              try {
                  client = JSON.parse(storedClient);
              } catch {
                  client = null;
              }
          }

          const clientId = client?.id ?? client?.clientId ?? client?.client_id ?? '';

          if (!clientId) {
              toast.error('You must be logged in to add a property');
              return;
          }

          try {
              const data = new FormData();
              data.append('client_id', clientId);

              Object.keys(formData).forEach((key) => {
                  if (key === 'overview' || key === 'highlights') {
                      data.append(key, JSON.stringify(formData[key]));
                  } else {
                      data.append(key, formData[key]);
                  }
              });

              if (mainImage) {
                  data.append('main_image', mainImage);
              }

              if (mainVideo) {
                  data.append('main_video', mainVideo);
              }

              galleryImages.forEach((img) => {
                  data.append('images', img.file);
              });

              const response = await API.post('/api/hotsales/add', data, {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                  },
              });

              const newPropertyId = response.data.property?.id ?? response.data.id;

              if (!newPropertyId) {
                  console.error('No property id returned from add endpoint:', response.data);
                  toast.error('Property saved, but could not proceed to payment. Contact support.');
                  return;
              }

              toast.success('Data Added Successfully');

              navigate('/dashboard/payment', {
                  state: {
                      clientId: Number(clientId),
                      propertyType: 'hot_sales',
                      propertyId: newPropertyId,
                      amount: 2500,
                      listingLabel: formData.title || 'Property Listing',
                  },
              });
          } catch (error) {
              console.error(error);
              toast.error('Something went wrong');
          }
      };

       const getHotSales = useCallback(async () => {
  try {
    setLoading(true);
    const response = await API.get("/api/hotsales/show");
    setHotSales(response.data?.hotSales || response.data);
  } catch (error) {
    toast.error("Fail to load data");
  } finally {
    setLoading(false);
  }
}, []);
          


  const getHotSaleById = useCallback(async (id) => {
    try {
      const response = await API.get(`/api/hotsales/show/${id}`);
      setSelectedProperty(response.data);
    } catch (error) {
      toast.error("Cannot load property");
    }
  }, []);

  // --- EDIT MODE: fetch existing hot sale and populate form ---
const fetchHotSaleForEdit = async (id) => {
    try {
        const res = await API.get(`/api/hotsales/show/${id}`);
        const data = res.data;

        const overview = Array.isArray(data.overview)
            ? data.overview
            : data.overview
                ? JSON.parse(data.overview)
                : [];

        const highlights = Array.isArray(data.highlights)
            ? data.highlights
            : data.highlights
                ? JSON.parse(data.highlights)
                : [];

        setFormData({
            title: data.title || '',
            description: data.description || '',
            price: data.price || '',
            property_type: data.property_type || '',
            rate: data.rate || '',
            duration: data.duration || 'year',
            area_sqft: data.area_sqft || '',
            city: data.city || '',
            map_address: data.map_address || '',
            location: data.location || '',
            overview,
            highlights,
            status: data.status || '',
        });

        // Existing main image/video come back as data URIs
        setMainImage(null);
        setMainImagePreview(data.main_image || null);

        setMainVideo(null);
        setMainVideoPreview(data.main_video || null);

        // Existing gallery images — treat them as previews
        const existingGallery = (data.gallery_images || []).map((img, index) => ({
            id: `existing-${index}`,
            preview: typeof img === 'string' ? img : img.url || '',
            file: null,
            isExisting: true,
        }));
        setGalleryImages(existingGallery);

    } catch (error) {
        console.log(error);
        toast.error("Failed to load property details");
    }
};

// --- EDIT MODE: submit updates ---
const handleHotSalesEditSubmit = async (e, id) => {
    e.preventDefault();

    try {
        const data = new FormData();

        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("property_type", formData.property_type);
        data.append("rate", formData.rate);
        data.append("duration", formData.duration);
        data.append("area_sqft", formData.area_sqft);
        data.append("city", formData.city);
        data.append("map_address", formData.map_address);
        data.append("location", formData.location);
        data.append("status", formData.status || "active");
        data.append("overview", JSON.stringify(formData.overview));
        data.append("highlights", JSON.stringify(formData.highlights));

        // Only attach if user picked a new one
        if (mainImage) data.append("main_image", mainImage);
        if (mainVideo) data.append("main_video", mainVideo);

        // Only attach gallery images if the user added new files
        const newGalleryFiles = galleryImages.filter((img) => !img.isExisting && img.file);
        if (newGalleryFiles.length > 0) {
            newGalleryFiles.forEach((img) => data.append("images", img.file));
        }

        await API.put(`/api/hotsales/edit/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Property updated successfully");
        navigate(`/dashboard/hot-sales/profile/${id}`); 

    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to update property");
    }
};

const handleDeleteHotSale = async (id) => {
    try {
        await API.delete(`/api/hotsales/delete/${id}`);
        toast.success("Property deleted successfully");

    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to delete property");
    }
};
  const getclientdata = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await API.get(`/api/clients/${id}`);
      setClient(response.data?.client || response.data);
    } catch (error) {
      toast.error("Cannot load client data");
    } finally {
      setLoading(false);
    }
  };

// ================== STAY TO BUY ==================

const [stayFormData, setStayFormData] = useState({
    client_id: '',
    title: '',
    description: '',
    overview: [],
    price: '',
    property_type: '',
    highlights: [],
    area_sqft: '',
    city: '',
    map_address: '',
    location: '',
    duration: 'month',
    status: 'pending',
});

const handleStayChange = (e) => {
    const { name, value } = e.target;
    setStayFormData((prev) => ({ ...prev, [name]: value }));
};

// --- Overview (title/value pairs, same pattern as hot_sales) ---
const addStayOverview = () => {
    setStayFormData((prev) => ({
        ...prev,
        overview: [...prev.overview, { title: overviewOptions[0].value, value: '' }],
    }));
};

const removeStayOverview = (index) => {
    setStayFormData((prev) => ({
        ...prev,
        overview: prev.overview.filter((_, i) => i !== index),
    }));
};

const handleStayOverviewChange = (index, field, value) => {
    setStayFormData((prev) => {
        const updated = [...prev.overview];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, overview: updated };
    });
};

// --- Highlights ---
const handleStayHighlightChange = (highlight) => {
    setStayFormData((prev) => ({
        ...prev,
        highlights: prev.highlights.includes(highlight)
            ? prev.highlights.filter((h) => h !== highlight)
            : [...prev.highlights, highlight],
    }));
};

// --- Main Image ---
const [stayMainImage, setStayMainImage] = useState(null);
const [stayMainImagePreview, setStayMainImagePreview] = useState(null);

const handleStayMainImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStayMainImage(file);
    setStayMainImagePreview(URL.createObjectURL(file));
};

const removeStayMainImage = () => {
    setStayMainImage(null);
    setStayMainImagePreview(null);
};

// --- Main Video ---
const [stayMainVideo, setStayMainVideo] = useState(null);
const [stayMainVideoPreview, setStayMainVideoPreview] = useState(null);

const handleStayMainVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStayMainVideo(file);
    setStayMainVideoPreview(URL.createObjectURL(file));
};

const removeStayMainVideo = () => {
    setStayMainVideo(null);
    setStayMainVideoPreview(null);
};

// --- Gallery Images ---
const STAY_MAX_GALLERY_IMAGES = 10;
const [stayGalleryImages, setStayGalleryImages] = useState([]);
const [stayGalleryDragActive, setStayGalleryDragActive] = useState(false);

const addStayGalleryFiles = (files) => {
    const remainingSlots = STAY_MAX_GALLERY_IMAGES - stayGalleryImages.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    const newImages = filesToAdd.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
    }));

    setStayGalleryImages((prev) => [...prev, ...newImages]);
};

const handleStayImages = (e) => {
    if (e.target.files?.length) addStayGalleryFiles(e.target.files);
};

const handleStayGalleryDrop = (e) => {
    e.preventDefault();
    setStayGalleryDragActive(false);
    if (e.dataTransfer.files?.length) addStayGalleryFiles(e.dataTransfer.files);
};

const removeStayGalleryImage = (e, id) => {
    e.stopPropagation();
    setStayGalleryImages((prev) => prev.filter((img) => img.id !== id));
};

// --- Submit ---
const handleStaySubmit = async (e, clientIdOverride) => {
    if (typeof e?.preventDefault === 'function') {
        e.preventDefault();
    }

    const resolvedClientId = clientIdOverride || e?.clientId || stayFormData.client_id || localStorage.getItem("clientId");

    if (!resolvedClientId) {
        toast.error("Unable to identify the client. Please try again.");
        return;
    }

    if (!stayMainImage) {
        toast.error("Main image is required.");
        return;
    }

    try {
        const data = new FormData();

        data.append("client_id", resolvedClientId);
        data.append("title", stayFormData.title);
        data.append("description", stayFormData.description);
        data.append("price", stayFormData.price);
        data.append("property_type", stayFormData.property_type);
        data.append("area_sqft", stayFormData.area_sqft);
        data.append("city", stayFormData.city);
        data.append("map_address", stayFormData.map_address);
        data.append("location", stayFormData.location);
        data.append("duration", stayFormData.duration);
        data.append("status", stayFormData.status);
        data.append("overview", JSON.stringify(stayFormData.overview));
        data.append("highlights", JSON.stringify(stayFormData.highlights));

        data.append("main_image", stayMainImage);
        if (stayMainVideo) data.append("main_video", stayMainVideo);

        stayGalleryImages.forEach((img) => data.append("images", img.file));

        await API.post("/api/staystobuy/add", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Stay to buy property added successfully");
        navigate("/dashboard/staystobuy");

    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to add property");
    }
};

// --- Reset (call this if navigating away or after successful submit) ---
const resetStayForm = () => {
    setStayFormData({
        client_id: '',
        title: '',
        description: '',
        overview: [],
        price: '',
        property_type: '',
        highlights: [],
        area_sqft: '',
        city: '',
        map_address: '',
        location: '',
        duration: 'month',
        status: 'pending',
    });
    setStayMainImage(null);
    setStayMainImagePreview(null);
    setStayMainVideo(null);
    setStayMainVideoPreview(null);
    setStayGalleryImages([]);
};


const getStayToBuy = useCallback(async () => {
    try {
        const response = await API.get("/api/staystobuy/show");
        const payload = response?.data;
        const normalizedStayToBuy = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.data)
                ? payload.data
                : Array.isArray(payload?.stayToBuy)
                    ? payload.stayToBuy
                    : [];

        setStayToBuy(normalizedStayToBuy);
    } catch (error) {
        toast.error("Failed to load stay to buy properties");
        setStayToBuy([]);
    }
}, []);

  const fetchStayToBuyForEdit = useCallback(async (id) => {
    if (!id) return;

    try {
      const response = await API.get(`/api/staystobuy/show/${id}`);
      const payload = response?.data;
      const data = payload?.data ?? payload;

      const overview = Array.isArray(data?.overview)
        ? data.overview
        : data?.overview
          ? JSON.parse(data.overview)
          : [];

      const highlights = Array.isArray(data?.highlights)
        ? data.highlights
        : data?.highlights
          ? JSON.parse(data.highlights)
          : [];

      setStayFormData({
        client_id: data?.client_id || '',
        title: data?.title || '',
        description: data?.description || '',
        overview,
        price: data?.price || '',
        property_type: data?.property_type || '',
        highlights,
        area_sqft: data?.area_sqft || '',
        city: data?.city || '',
        map_address: data?.map_address || '',
        location: data?.location || '',
        duration: data?.duration || 'month',
        status: data?.status || 'pending',
      });

      setStayMainImage(null);
      setStayMainImagePreview(data?.main_image || null);

      setStayMainVideo(null);
      setStayMainVideoPreview(data?.main_video || null);

      const existingGallery = (Array.isArray(data?.images) ? data.images : []).map((img, index) => ({
        id: `existing-${index}`,
        preview: typeof img === 'string' ? img : img?.url || '',
        file: null,
        isExisting: true,
      }));
      setStayGalleryImages(existingGallery);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load property details");
    }
  }, []);

  const getStayToBuyById = useCallback(async (id) => {
    if (!id) {
      setStayToBuySelectedProperty(null);
      return;
    }

    try {
      const response = await API.get(`/api/staystobuy/show/${id}`);
      const payload = response?.data;
      const property = payload?.data ?? payload;
      const normalizedProperty = {
        ...property,
        gallery_images: Array.isArray(property?.images)
          ? property.images
          : Array.isArray(property?.gallery_images)
            ? property.gallery_images
            : [],
        main_image: property?.main_image || property?.image || null,
      };
      setStayToBuySelectedProperty(normalizedProperty);
    } catch (error) {
      setStayToBuySelectedProperty(null);
      toast.error("Cannot load property");
    }
  }, []);


   
// --- EDIT MODE: submit updates ---
const handleStayToBuyEditSubmit = async (e, id) => {
    e.preventDefault();

    try {
        const data = new FormData();

        data.append("title", stayFormData.title);
        data.append("description", stayFormData.description);
        data.append("price", stayFormData.price);
        data.append("property_type", stayFormData.property_type);
        data.append("duration", stayFormData.duration);
        data.append("area_sqft", stayFormData.area_sqft);
        data.append("city", stayFormData.city);
        data.append("map_address", stayFormData.map_address);
        data.append("location", stayFormData.location);
        data.append("status", stayFormData.status || "pending");
        data.append("overview", JSON.stringify(stayFormData.overview));
        data.append("highlights", JSON.stringify(stayFormData.highlights));

        if (stayMainImage) data.append("main_image", stayMainImage);
        if (stayMainVideo) data.append("main_video", stayMainVideo);

        const newGalleryFiles = stayGalleryImages.filter((img) => !img.isExisting && img.file);
        if (newGalleryFiles.length > 0) {
            newGalleryFiles.forEach((img) => data.append("images", img.file));
        }

        await API.put(`/api/staytobuy/edit/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Property updated successfully");
        navigate(`/dashboard/staytobuy/profile/${id}`);

    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to update property");
    }
};


const handlestaytobuydelete = async (id) => {
    try {
        await API.delete(`/api/staystobuy/delete/${id}`);
        toast.success("Property deleted successfully");

    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to delete property");
    }
};



//----------------------------stay to rent -----------------

const [staytorentFormData, setStaytorentFormData] = useState({
  client_id: "",
  title: "",
  description: "",
  overview: [],
  price: "",
  property_type: "",
  highlights: [],
  area_sqft: "",
  city: "",
  map_address: "",
  location: "",
  duration: "month",
  status: "pending",
});

const handleStayToRentChange = (e) => {
  const { name, value } = e.target;
  setStaytorentFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

// ==================== OVERVIEW ====================

const addStaytoRentoverview = () => {
  setStaytorentFormData((prev) => ({
    ...prev,
    overview: [
      ...prev.overview,
      {
        title: overviewOptions[0].value,
        value: "",
      },
    ],
  }));
};

const removeStayToRentOverview = (index) => {
  setStaytorentFormData((prev) => ({
    ...prev,
    overview: prev.overview.filter((_, i) => i !== index),
  }));
};

const handleStaytorentOverviewChange = (index, field, value) => {
  setStaytorentFormData((prev) => {
    const updated = [...prev.overview];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    return {
      ...prev,
      overview: updated,
    };
  });
};

// ==================== HIGHLIGHTS ====================

const handleStaytorentHighlightschanges = (highlight) => {
  setStaytorentFormData((prev) => ({
    ...prev,
    highlights: prev.highlights.includes(highlight)
      ? prev.highlights.filter((item) => item !== highlight)
      : [...prev.highlights, highlight],
  }));
};

// ==================== MAIN IMAGE ====================

const [staytorentImage, setstaytorentImage] = useState(null);
const [staytorentMainImagePreview, setStaytorentMainImagePreview] =useState(null);

const handleStaytorentmainImage = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setstaytorentImage(file);
  setStaytorentMainImagePreview(URL.createObjectURL(file));
};

const removeStaytorentMainImage = () => {
  if (staytorentMainImagePreview) {
    URL.revokeObjectURL(staytorentMainImagePreview);
  }

  setstaytorentImage(null);
  setStaytorentMainImagePreview(null);
};

// ==================== MAIN VIDEO ====================

const [staytorentMainVideo, setstaytorentMainVideo] = useState(null);
const [staytorentMainVideoPreview, setstayTorentmainVideopreview] =
  useState(null);

const handlestaytorentMainVideo = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setstaytorentMainVideo(file);
  setstayTorentmainVideopreview(URL.createObjectURL(file));
};

const removestaytorentmainVideo = () => {
  if (staytorentMainVideoPreview) {
    URL.revokeObjectURL(staytorentMainVideoPreview);
  }

  setstaytorentMainVideo(null);
  setstayTorentmainVideopreview(null);
};

// ==================== GALLERY ====================


const [staytorentGalleryImages, setStaytorentGalleryImages] = useState([]);
const [staytorentGalleryImagesActive, setstaytorentGallery] = useState(false);

const addstaytorentGalleryFiles = (files) => {
  const remainingSlots =
    STAY_MAX_GALLERY_IMAGES - staytorentGalleryImages.length;

  const filesToAdd = Array.from(files).slice(0, remainingSlots);

  const newImages = filesToAdd.map((file) => ({
    id: `${file.name}-${Date.now()}-${Math.random()}`,
    file,
    preview: URL.createObjectURL(file),
  }));

  setStaytorentGalleryImages((prev) => [...prev, ...newImages]);
};

const handleStaytorentImages = (e) => {
  if (e.target.files?.length) {
    addstaytorentGalleryFiles(e.target.files);
  }
};

const removeStaytorentGalleryImages = (e, id) => {
  e.stopPropagation();

  setStaytorentGalleryImages((prev) => {
    const image = prev.find((img) => img.id === id);

    if (image) {
      URL.revokeObjectURL(image.preview);
    }

    return prev.filter((img) => img.id !== id);
  });
};

// ==================== SUBMIT ====================

const handleStaytorentSubmit = async (e, clientIdOverride) => {
  e.preventDefault();

  const resolvedClientId =
    clientIdOverride ||
    staytorentFormData.client_id ||
    localStorage.getItem("clientId");

  if (!resolvedClientId) {
    toast.error("Unable to identify the client.");
    return;
  }

  if (!staytorentImage) {
    toast.error("Main image is required.");
    return;
  }

  try {
    const data = new FormData();

    data.append("client_id", resolvedClientId);
    data.append("title", staytorentFormData.title);
    data.append("description", staytorentFormData.description);
    data.append("price", staytorentFormData.price);
    data.append("property_type", staytorentFormData.property_type);
    data.append("area_sqft", staytorentFormData.area_sqft);
    data.append("city", staytorentFormData.city);
    data.append("map_address", staytorentFormData.map_address);
    data.append("location", staytorentFormData.location);
    data.append("duration", staytorentFormData.duration);
    data.append("status", staytorentFormData.status);

    data.append(
      "overview",
      JSON.stringify(staytorentFormData.overview)
    );

    data.append(
      "highlights",
      JSON.stringify(staytorentFormData.highlights)
    );

    data.append("main_image", staytorentImage);

    if (staytorentMainVideo) {
      data.append("main_video", staytorentMainVideo);
    }

    staytorentGalleryImages.forEach((img) => {
      data.append("images", img.file);
    });

    await API.post("/api/staystorent/add", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Stay to Rent property added successfully.");

    resetStaytorentForm();

    navigate("/dashboard/staystorent");
  } catch (error) {
    console.log(error);

    toast.error(
      error?.response?.data?.message || "Failed to add property."
    );
  }
};

// ==================== RESET ====================

const resetStaytorentForm = () => {
  setStaytorentFormData({
    client_id: "",
    title: "",
    description: "",
    overview: [],
    price: "",
    property_type: "",
    highlights: [],
    area_sqft: "",
    city: "",
    map_address: "",
    location: "",
    duration: "month",
    status: "pending",
  });

  setstaytorentImage(null);
  setStaytorentMainImagePreview(null);

  setstaytorentMainVideo(null);
  setstayTorentmainVideopreview(null);

  staytorentGalleryImages.forEach((img) =>
    URL.revokeObjectURL(img.preview)
  );

  setStaytorentGalleryImages([]);
  setstaytorentGallery(false);
};


const getStayToRent = useCallback(async () => {
  try {
    const response = await API.get("/api/staystorent/show");
    const payload = response?.data;
    const normalizedStayToRent = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.stayToRent)
          ? payload.stayToRent
          : [];
    setStayToRent(normalizedStayToRent);
  } catch (error) {
    toast.error("Failed to load stay to rent properties");
    setStayToRent([]);
  }
}, []);
const [staytorentpropterty,setstaytorentproperty] = useState(null);
const getStayTorentById = useCallback(async (id) => {
  if (!id) {
    setstaytorentproperty(null);
    return;
  }

  try {
    const response = await API.get(`/api/staystorent/show/${id}`);
    const payload = response?.data;
    const property = payload?.data ?? payload;
    const normalizedProperty = {
      ...property,
      gallery_images: Array.isArray(property?.images)
        ? property.images
        : Array.isArray(property?.gallery_images)
          ? property.gallery_images
          : [],
      main_image: property?.main_image || property?.image || null,
    };
    setstaytorentproperty(normalizedProperty);
  } catch (error) {
    setstaytorentproperty(null);
    toast.error("Cannot load property");
  }
}, []);



const fetchStayTorentForEdit = useCallback(async (id) => {
    if (!id) return;

    try {
      const response = await API.get(`/api/staystorent/show/${id}`);
      const payload = response?.data;
      const data = payload?.data ?? payload;

      const overview = Array.isArray(data?.overview)
        ? data.overview
        : data?.overview
          ? JSON.parse(data.overview)
          : [];

      const highlights = Array.isArray(data?.highlights)
        ? data.highlights
        : data?.highlights
          ? JSON.parse(data.highlights)
          : [];

      setStaytorentFormData({
        client_id: data?.client_id || '',
        title: data?.title || '',
        description: data?.description || '',
        overview,
        price: data?.price || '',
        property_type: data?.property_type || '',
        highlights,
        area_sqft: data?.area_sqft || '',
        city: data?.city || '',
        map_address: data?.map_address || '',
        location: data?.location || '',
        duration: data?.duration || 'month',
        status: data?.status || 'pending',
      });

      setstaytorentImage(null);
      setStaytorentMainImagePreview(data?.main_image || null);

      setstaytorentMainVideo(null);
      setstayTorentmainVideopreview(data?.main_video || null);

      const existingGallery = (Array.isArray(data?.images) ? data.images : []).map((img, index) => ({
        id: `existing-${index}`,
        preview: typeof img === 'string' ? img : img?.url || '',
        file: null,
        isExisting: true,
      }));
      setStaytorentGalleryImages(existingGallery);
    } catch (error) {
      console.log(error);
      toast.error('Failed to load property details');
    }
}, []); // setState functions are stable, API/toast are module imports — empty deps is correct

  // --- EDIT MODE: submit updates for stay to rent ---
  const handleStaytorentEditSubmit = async (e, id) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    try {
      const data = new FormData();

      data.append('title', staytorentFormData.title);
      data.append('description', staytorentFormData.description);
      data.append('price', staytorentFormData.price);
      data.append('property_type', staytorentFormData.property_type);
      data.append('duration', staytorentFormData.duration);
      data.append('area_sqft', staytorentFormData.area_sqft);
      data.append('city', staytorentFormData.city);
      data.append('map_address', staytorentFormData.map_address);
      data.append('location', staytorentFormData.location);
      data.append('status', staytorentFormData.status || 'pending');
      data.append('overview', JSON.stringify(staytorentFormData.overview));
      data.append('highlights', JSON.stringify(staytorentFormData.highlights));

      if (staytorentImage) data.append('main_image', staytorentImage);
      if (staytorentMainVideo) data.append('main_video', staytorentMainVideo);

      const newGalleryFiles = staytorentGalleryImages.filter((img) => !img.isExisting && img.file);
      if (newGalleryFiles.length > 0) {
        newGalleryFiles.forEach((img) => data.append('images', img.file));
      }

      await API.put(`/api/staystorent/edit/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Property updated successfully');
      navigate(`/dashboard/staystorent/profile/${id}`);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Failed to update property');
    }
  };


  
const handleDeleteStaysToRent = async (id) => {
    try {
        await API.delete(`/api/staystorent/delete/${id}`);
        toast.success("Property deleted successfully");

    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to delete property");
    }
};


{/*------------------------lands------------------------ */}


// ==========================================================
// LAND FORM STATE & HANDLERS
// Add these inside your ClientProvider component in
// ClientContext.jsx, alongside your existing hot sales state.
// Then include them in the value={} object passed to the provider.
// ==========================================================

const MAX_LAND_GALLERY_IMAGES = 10;

const [landFormData, setLandFormData] = useState({
    title: "",
    description: "",
    price: "",
    land_size: "",
    size_unit: "perches",
    duration: "month",
    location: "",
    city: "",
    overview: [{ title: overviewOptions[0]?.value || "", value: "" }],
});

const [landMainImage, setLandMainImage] = useState(null);
const [landMainImagePreview, setLandMainImagePreview] = useState(null);

const [landMainVideo, setLandMainVideo] = useState(null);
const [landMainVideoPreview, setLandMainVideoPreview] = useState(null);

const [landGalleryImages, setLandGalleryImages] = useState([]);
const [landGalleryDragActive, setLandGalleryDragActive] = useState(false);


// ---------- Basic field change ----------
const handleLandChange = (e) => {
    const { name, value } = e.target;
    setLandFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
};


// ---------- Overview handlers ----------
const handleLandOverviewChange = (index, field, value) => {
    setLandFormData((prev) => {
        const updatedOverview = [...prev.overview];
        updatedOverview[index] = {
            ...updatedOverview[index],
            [field]: value,
        };
        return { ...prev, overview: updatedOverview };
    });
};

const addLandOverview = () => {
    setLandFormData((prev) => ({
        ...prev,
        overview: [
            ...prev.overview,
            { title: overviewOptions[0]?.value || "", value: "" },
        ],
    }));
};

const removeLandOverview = (index) => {
    setLandFormData((prev) => ({
        ...prev,
        overview: prev.overview.filter((_, i) => i !== index),
    }));
};


// ---------- Main image handlers ----------
const handleLandMainImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLandMainImage(file);
    setLandMainImagePreview(URL.createObjectURL(file));
};

const removeLandMainImage = () => {
    setLandMainImage(null);
    setLandMainImagePreview(null);
};


// ---------- Main video handlers ----------
const handleLandMainVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLandMainVideo(file);
    setLandMainVideoPreview(URL.createObjectURL(file));
};


// ---------- Gallery image handlers ----------
const addLandGalleryFiles = (files) => {
    const remainingSlots = MAX_LAND_GALLERY_IMAGES - landGalleryImages.length;
    if (remainingSlots <= 0) return;

    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    const newImages = filesToAdd.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
    }));

    setLandGalleryImages((prev) => [...prev, ...newImages]);
};

const handleLandImages = (e) => {
    if (e.target.files?.length > 0) {
        addLandGalleryFiles(e.target.files);
    }
    e.target.value = "";
};

const handleLandGalleryDrop = (e) => {
    e.preventDefault();
    setLandGalleryDragActive(false);

    if (e.dataTransfer.files?.length > 0) {
        addLandGalleryFiles(e.dataTransfer.files);
    }
};

const removeLandGalleryImage = (e, id) => {
    e.stopPropagation();
    setLandGalleryImages((prev) => prev.filter((img) => img.id !== id));
};


// ---------- Submit ----------
const handleLandSubmit = async (e) => {
    e.preventDefault();

    let client = null;
    const storedClient = localStorage.getItem("client");

    if (storedClient && storedClient !== "undefined") {
        try {
            client = JSON.parse(storedClient);
        } catch {
            client = null;
        }
    }

    const clientId = client?.id ?? client?.clientId ?? client?.client_id ?? "";

    if (!clientId) {
        toast.error("You must be logged in to add a property");
        return;
    }

    if (!landMainImage) {
        toast.error("Main image is required");
        return;
    }

    try {
        const data = new FormData();

        data.append("client_id", clientId);
        data.append("title", landFormData.title);
        data.append("description", landFormData.description);
        data.append("price", landFormData.price);
        data.append("land_size", landFormData.land_size);
        data.append("size_unit", landFormData.size_unit);
        data.append("duration", landFormData.duration);
        data.append("location", landFormData.location);
        data.append("city", landFormData.city);
        data.append("overview", JSON.stringify(landFormData.overview));

        data.append("main_image", landMainImage);

        if (landMainVideo) {
            data.append("main_video", landMainVideo);
        }

        landGalleryImages.forEach((img) => {
            data.append("images", img.file);
        });

        const res = await API.post("/api/lands/add", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success(res.data.message || "Land added successfully");

        // Reset form
        setLandFormData({
            title: "",
            description: "",
            price: "",
            land_size: "",
            size_unit: "perches",
            duration: "month",
            location: "",
            city: "",
            overview: [{ title: overviewOptions[0]?.value || "", value: "" }],
        });
        setLandMainImage(null);
        setLandMainImagePreview(null);
        setLandMainVideo(null);
        setLandMainVideoPreview(null);
        setLandGalleryImages([]);

    } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to add land");
    }
};


const [lands, setLands] = useState([]);
const getlands = useCallback(async () => {
  try {
    setLoading(true);
    const response = await API.get("/api/lands/show");
    const rawLands = response.data?.lands || response.data || [];
    const apiBaseUrl = API.defaults.baseURL?.replace(/\/$/, "") || "";
    const normalizeImagePath = (path) => {
      if (!path) return null;
      return path.startsWith("http") ? path : `${apiBaseUrl}${path}`;
    };

    const normalizedLands = rawLands.map((land) => ({
      ...land,
      main_image: normalizeImagePath(
        land?.main_image || (land?.id ? `/api/lands/main-image/${land.id}` : null)
      ),
    }));
    setLands(normalizedLands);
  } catch (error) {
    toast.error("Fail to load data");
  } finally {
    setLoading(false);
  }
}, []);

  const[landsSelectedProperty,setlandsSelectedProperty] = useState(null);

  const getlandsById = async (id) => {
    if (!id) {
      setlandsSelectedProperty(null);
      return;
    }

    try {
      const response = await API.get(`/api/lands/show/${id}`);
      const payload = response?.data;
      const land = payload?.land ?? payload?.data ?? payload;
      const apiBaseUrl = API.defaults.baseURL?.replace(/\/$/, "") || "";

      const normalizeImagePath = (path) => {
        if (!path) return null;
        return path.startsWith("http") ? path : `${apiBaseUrl}${path}`;
      };

      const normalizedLand = {
        ...land,
        main_image: normalizeImagePath(land?.main_image || (land?.id ? `/api/lands/main-image/${land.id}` : null)),
        main_video: normalizeImagePath(land?.main_video || (land?.id ? `/api/lands/main-video/${land.id}` : null)),
        gallery_images: Array.isArray(land?.images)
          ? land.images.map(normalizeImagePath)
          : Array.isArray(land?.gallery_images)
            ? land.gallery_images.map(normalizeImagePath)
            : [],
      };

      setlandsSelectedProperty(normalizedLand);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load land details");
      setlandsSelectedProperty(null);
    }
  };


  const deleteLands = async() =>{
     try {
        await API.delete(`/api/lands/delete/${id}`);
        toast.success("Property deleted successfully");

    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to delete property");
    }

  }
  return (
  <clientContext.Provider
  value={{
    hotSales,
    selectedProperty,
    client,
    loading,

    getHotSales,
    getHotSaleById,
    getclientdata,

    formData,
    setFormData,

    handleChange,
    handleSubmit,

    handleOverviewChange,
    addOverview,
    removeOverview,

    handleHighlightChange,

    mainImage,
    setMainImage,
    mainImagePreview,
    setMainImagePreview,
    mainDragActive,
    setMainDragActive,

    mainVideo,
    setMainVideo,
    mainVideoPreview,
    setMainVideoPreview,

    handleMainImage,
    handleMainVideo,
    handleMainDrop,
    removeMainImage,

    galleryImages,
    setGalleryImages,
    MAX_GALLERY_IMAGES,
    galleryDragActive,
    setGalleryDragActive,

    handleImages,
    handleGalleryDrop,
    removeGalleryImage,

     handleHotSalesEditSubmit ,
     fetchHotSaleForEdit,
     handleDeleteHotSale,

      stayFormData,
    handleStayChange,

    addStayOverview,
    removeStayOverview,
    handleStayOverviewChange,

    handleStayHighlightChange,

    stayMainImage,
    stayMainImagePreview,
    handleStayMainImage,
    removeStayMainImage,

    stayMainVideo,
    stayMainVideoPreview,
    handleStayMainVideo,
    removeStayMainVideo,

    stayGalleryImages,
    STAY_MAX_GALLERY_IMAGES,
    stayGalleryDragActive,
    setStayGalleryDragActive,
    handleStayImages,
    handleStayGalleryDrop,
    removeStayGalleryImage,

    handleStaySubmit,
    resetStayForm,
    getStayToBuy,
    fetchStayToBuyForEdit,
    stayToBuy,
    getStayToBuyById,
    staytoBuySelectedProperty,
    getStayToRent,
    stayToRent,

    handleStayToBuyEditSubmit,
    fetchHotSaleForEdit,
    handlestaytobuydelete,

    staytorentFormData,
    staytorentImage,
    staytorentMainImagePreview,
    staytorentMainVideo,
    staytorentMainVideoPreview,
    staytorentGalleryImages,
    staytorentGalleryImagesActive,
    handleStaytorentmainImage,
    removeStaytorentMainImage,
    handlestaytorentMainVideo,
    removestaytorentmainVideo,
    handleStaytorentImages,
    removeStaytorentGalleryImages,
    handleStaytorentOverviewChange,
    addStaytoRentoverview,
    removeStayToRentOverview,
    handleStaytorentHighlightschanges,
    handleStayToRentChange,
    handleStaytorentSubmit,
    fetchStayTorentForEdit,
    handleStaytorentEditSubmit,
    staytorentpropterty,
    getStayTorentById,
    handleDeleteStaysToRent,
    landFormData,
        handleLandChange,
        handleLandSubmit,

        handleLandOverviewChange,
        addLandOverview,
        removeLandOverview,

        landMainImage,
        landMainImagePreview,
        handleLandMainImage,
        removeLandMainImage,

        landMainVideo,
        landMainVideoPreview,
        handleLandMainVideo,
        setLandMainVideo,
        setLandMainVideoPreview,

        landGalleryImages,
        MAX_LAND_GALLERY_IMAGES,
        landGalleryDragActive,
        setLandGalleryDragActive,
        handleLandImages,
        handleLandGalleryDrop,
        removeLandGalleryImage,
        lands,
        getlands,
        landsSelectedProperty,
        getlandsById,
        deleteLands

  }}
>
  {children}
</clientContext.Provider>
  );
}

