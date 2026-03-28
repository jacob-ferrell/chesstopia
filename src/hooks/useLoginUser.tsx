import { useState } from "react";
import login from "../api/login";
import { useNavigate } from "react-router";
import useCurrentUser from "./useCurrentUser";
import { Credentials } from "../types";

interface UseLoginUserResult {
  credentials: Credentials;
  setCredentials: React.Dispatch<React.SetStateAction<Credentials>>;
  loginUser: (e?: React.FormEvent | null) => Promise<void>;
  isLoading: boolean;
}

export function useLoginUser(): UseLoginUserResult {
  const [credentials, setCredentials] = useState<Credentials>({ email: "", password: "" });

  const { isLoading, refetch } = useCurrentUser();
  const navigate = useNavigate();

  async function loginUser(e: React.FormEvent | null = null): Promise<void> {
    e?.preventDefault();
    try {
      const { email, password } = credentials;
      await login({ email, password });
      const { data: user } = await refetch();
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
