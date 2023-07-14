import LoginForm from "./LoginForm";
import { useLoginUser } from "../../hooks/useLoginUser";
import { useEffect } from "react";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { user, isLoading: userIsLoading } = useCurrentUser();

  const { credentials, setCredentials, loginUser } = useLoginUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (userIsLoading || user === null || location.pathname.includes("signup"))
      return;
    navigate("/dashboard");
  }, [userIsLoading, location.pathname]);

  /*  function loginAsJacob() {
    setCredentials({
      email: "boomkablamo@gmail.com",
      password: "",
    });
    loginUser();
  }

  function loginAsCindy() {
    setCredentials({
      email: "cindy@gmail.com",
      password: "",
    });
    loginUser();
  } */

  return (
    <div className="flex flex-col gap-6 p-4 max-w-xl w-full">
      <h2 className="text-gray-100 text-3xl font-medium">Login</h2>
      <LoginForm
        credentials={credentials}
        setCredentials={setCredentials}
        login={loginUser}
      />
      <button
        onClick={() => navigate("/signup")}
        className="text-gray-100 bg-gradient-to-b from-sky-900 to-sky-600 hover:brightness-125 shadow font-medium rounded py-2"
      >
        Register
      </button>
      {/* <button onClick={loginAsJacob}>Login As Jacob</button>
      <button onClick={loginAsCindy}>Login As Cindy</button> */}
    </div>
  );
}
