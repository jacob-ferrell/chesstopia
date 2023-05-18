import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import login from "../api/login";
import axiosInstance from "../axios";
import getCurrentUser from "../api/getCurrentUser";

export default function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    localStorage.removeItem("token");
  }, [])

  async function loginAsJacob() {
    const res = await axiosInstance.post("auth/authenticate", {
      email: "boomkablamo@gmail.com",
      password: "asdf",
    });
    if (res.status !== 200) return;
    getCurrentUser().then((res) => {
      if (res.status !== 200) return;
      console.log(res);
      setUser(res.data);
    });
  }

  async function loginAsCindy() {
    const res = await axiosInstance.post("auth/authenticate", {
      email: "cindy@gmail.com",
      password: "asdf",
    });
    if (res.status !== 200) return;
    getCurrentUser().then((res) => {
      if (res.status !== 200) return;
      console.log(res);
      setUser(res.data);
    });
  }

  async function loginUser(e) {
    e.preventDefault();
    const res = await login({ email, password });
    if (res.status !== 200) return alert("Login Unsuccessful");
    getCurrentUser().then((res) => {
      if (res.status !== 200) return;
      console.log(res);
      setUser(res.data);
    });
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
      <button onClick={loginAsCindy}>Login As Cindy</button>
    </div>
  );
}
