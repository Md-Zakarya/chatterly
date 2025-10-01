import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function useLoginViewModel() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const { handleSubmit, control, setError, formState: { errors } } = useForm();

  useEffect(() => {
    console.log("Login component mounted");
    // Check if there's a success message from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state to prevent it from showing again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const onSubmit = async (data) => {
    console.log("Submitting login form");
    console.log("Submitted data:", data);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(ENDPOINTS.LOGIN, {
        username: data.username,
        password: data.password
      });

      if (response.status === 200 && response.data.success) {
        console.log("Login successful:", response.data);

        // Save user data to context
        login(response.data.user);

        // Redirect to the page user was trying to access, or home
        const from = location.state?.from?.pathname || "/home";
        navigate(from, { replace: true });
      }

    } catch (error) {
      console.error("Login error:", error);
      const message = error.response?.data?.message || "Login failed";
      setError("root", { message });

    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, control, errors, onSubmit, isLoading, successMessage };
}