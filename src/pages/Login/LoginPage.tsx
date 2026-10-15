import LoginForm from "./LoginForm";
import { useLoginUser } from "../../hooks/useLoginUser";
import { useEffect } from "react";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import useSignUp from "../../hooks/useSignUp";
import Spinner from "../../components/spinners/Spinner";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import AuthHero from "../../components/AuthHero";

export default function LoginPage() {
  const { user, isLoading: userIsLoading } = useCurrentUser();
  const { credentials, setCredentials, loginUser } = useLoginUser();
  const { signUp, loading } = useSignUp();
  const navigate = useNavigate();

  useEffect(() => {
    if (userIsLoading || user === null || location.pathname.includes("signup"))
      return;
    navigate("/dashboard");
  }, [userIsLoading, location.pathname]);

  async function handleGuestLoginClick(e: React.MouseEvent<HTMLButtonElement>) {
    signUp(e as unknown as React.FormEvent, true);
  }

  return (
    <div className="animate-fade-up flex flex-col gap-6">
      <AuthHero
        title="Welcome back"
        subtitle="Sign in to pick up your games where you left off."
      />
      <Card>
        <LoginForm
          credentials={credentials}
          setCredentials={setCredentials}
          login={loginUser}
        />

        <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-gray-500">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="outline" block onClick={() => navigate("/signup")}>
            Create an account
          </Button>
          <Button
            variant="secondary"
            block
            onClick={handleGuestLoginClick}
            disabled={loading}
          >
            {loading ? (
              <Spinner size="sm" text="Creating a guest account…" textClass="text-sm text-gray-100" />
            ) : (
              "Continue as guest"
            )}
          </Button>
        </div>
      </Card>
      <p className="text-center text-xs text-gray-500">
        Guest accounts let you try Chesstopia instantly, no sign up required.
      </p>
    </div>
  );
}
