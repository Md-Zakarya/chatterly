import { useEffect, useState } from 'react';
import  axiosInstance  from '../api/axiosInstance';
import { ENDPOINTS } from '../api/endpoints';
import  { ApiResponse } from '../models/ApiResponse';




export const useApiData = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);


    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(ENDPOINTS.DATA);
            setData(new ApiResponse(response.data));
            
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }   
    };
    useEffect(() => {
        fetchData();
    }, []);

return { data, loading, error, refetch: fetchData };
}