import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

export function useRegisterViewModel() {
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, control, setError, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("Submitting register form");
    console.log("Submitted data:", data);
    setIsLoading(true);
    
    try {
      const response = await axiosInstance.post(ENDPOINTS.REGISTER, {
        username: data.username,
        email: data.email,
        password: data.password,
        displayName: data.displayName || data.username
      });

      if (response.data.success) {
        // Registration successful, redirect to login
        navigate('/login', { 
          state: { message: 'Registration successful! Please log in.' }
        });
      }
    } catch (error) {
      console.error("Register error:", error);
      const message = error.response?.data?.message || "Registration failed";
      setError("root", { message });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, control, errors, onSubmit, isLoading };
}