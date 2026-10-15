import { useNavigate } from "react-router-dom";
import SignUpForm from "./SignUpForm";
import Card from "../../components/ui/Card";
import AuthHero from "../../components/AuthHero";

export default function SignUpPage() {
  const navigate = useNavigate();
  return (
    <div className="animate-fade-up flex flex-col gap-6">
      <AuthHero title="Create your account" subtitle="Play friends in real time, or challenge the computer." />
      <Card>
        <SignUpForm />
      </Card>
      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="focus-ring rounded font-semibold text-yellow-500 hover:text-yellow-400"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
