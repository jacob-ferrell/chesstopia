import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import login from "../api/login";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import getCurrentUser from "../api/getCurrentUser";

export default function LoginPage({}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data, refetch } = useQuery(["user"], getCurrentUser, {
    enabled: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  async function loginAsJacob() {
    try {
      const res = await login({
        email: "boomkablamo@gmail.com",
        password: "asdf",
      });
      const { data } = await refetch();
      navigate(`/user/${data.id}/dashboard`);
    } catch (error) {
      alert("Unsuccessful login. Error: " + error);
    }
  }

  async function loginAsCindy(e) {
    try {
      const res = await login({ email: "cindy@gmail.com", password: "asdf" });
      const { data } = await refetch();
      navigate(`/user/${data.id}/dashboard`);
    } catch (error) {
      alert("Unsuccessful login. Error: " + error);
    }
  }

  async function loginUser(e) {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      const { data } = await refetch();
      navigate(`/user/${data.id}/dashboard`);
    } catch (error) {
      alert("Unsuccessful login. Error: " + error);
    }
  }

  return (
    <div>
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        login={loginUser}
      />
      <button>Register</button>
      <button onClick={loginAsJacob}>Login As Jacob</button>
      <button onClick={(e) => loginAsCindy(e)}>Login As Cindy</button>
    </div>
  );
}
