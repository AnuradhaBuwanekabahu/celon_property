import API from "./api";





export const getHotSales = () => 
    API.get("/api/hotsales");



export const getHotSaleById = (id) =>
    API.get(`/api/hotsales/${id}`);




export const updateHotSale = (id, data) =>
    API.put(
        `/api/hotsales/${id}`,
        data,
        {
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }
    );