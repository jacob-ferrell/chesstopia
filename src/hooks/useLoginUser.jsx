import { useState } from "react";
import login from "../api/login";
import { useNavigate } from "react-router";
import getCurrentUser from "../api/getCurrentUser";
import useCurrentUser from "./useCurrentUser";

export function useLoginUser() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const { isLoading, refetch } = useCurrentUser();
  const navigate = useNavigate();

  async function loginUser(e = null) {
    e?.preventDefault();
    try {
      const { email, password } = credentials;
      await login({ email, password });
      const { user } = await refetch();
      navigate(`/dashboard`);
    } catch (error) {
      alert("Unsuccessful login. Error: " + error);
    }
  }

  return {
    credentials,
    setCredentials,
    loginUser,
    isLoading,
  };
}