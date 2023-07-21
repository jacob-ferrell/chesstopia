import { useState } from "react";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
import useCurrentUser from "./useCurrentUser";

export default function useSignUp() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const { refetch } = useCurrentUser();
  const navigate = useNavigate();

  async function signUp(e, isDemoUser = false) {
    e.preventDefault();
    try {
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error("Passwords must match");
      }
      const { email, password, firstName, lastName } = credentials;
      console.log(email, password, firstName, lastName);
      await axiosInstance.post("/auth/register", {
        email,
        password,
        firstName,
        lastName,
        isDemoUser
      });
      await refetch();
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  return { signUp, credentials, setCredentials };
}
