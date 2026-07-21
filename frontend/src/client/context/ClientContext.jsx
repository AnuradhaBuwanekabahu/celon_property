import { createContext, useState } from "react";
import API from "../api/clientapi";
import { toast } from "react-toastify";

export const clientContext = createContext();

export function ClientProvider({ children }) {
  const [hotSales, setHotSales] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);

  const getHotSales = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/hotsales/show");
      setHotSales(response.data?.hotSales || response.data);
    } catch (error) {
      toast.error("Fail to load data");
    } finally {
      setLoading(false);
    }
  };


  const getHotSaleById = async (id) => {
    try {
      const response = await API.get(`/api/hotsales/show/${id}`);
      setSelectedProperty(response.data);
    } catch (error) {
      toast.error("Cannot load property");
    }
  };

  return (
    <clientContext.Provider value={{ hotSales, selectedProperty, loading, getHotSales, getHotSaleById }}>
      {children}
    </clientContext.Provider>
  );
}