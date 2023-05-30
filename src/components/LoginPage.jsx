import LoginForm from "./LoginForm";
import { useLoginUser } from "../hooks/useLoginUser";
import { useEffect } from "react";

export default function LoginPage() {
  const { credentials, setCredentials, loginUser, isLoading } = useLoginUser();

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  function loginAsJacob() {
    setCredentials({
      email: "boomkablamo@gmail.com",
      password: "asdf",
    });
    loginUser();
  }

  function loginAsCindy() {
    setCredentials({
      email: "cindy@gmail.com",
      password: "asdf",
    });
    loginUser();
  }

  return (
    <div>
      <LoginForm
        credentials={credentials}
        setCredentials={setCredentials}
        login={loginUser}
      />
      <button>Register</button>
      <button onClick={loginAsJacob}>Login As Jacob</button>
      <button onClick={loginAsCindy}>Login As Cindy</button>
    </div>
  );
}