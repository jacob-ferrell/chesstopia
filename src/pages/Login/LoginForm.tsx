import { Credentials } from "../../types";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

interface LoginFormProps {
  credentials: Credentials;
  setCredentials: React.Dispatch<React.SetStateAction<Credentials>>;
  login: (e?: React.FormEvent | null) => Promise<void>;
}

export default function LoginForm({ credentials, setCredentials, login }: LoginFormProps) {
  return (
    <form onSubmit={login} className="flex flex-col gap-4">
      <Input
        id="email"
        type="email"
        label="Email"
        autoComplete="email"
        value={credentials.email}
        onChange={(e) =>
          setCredentials((prev) => ({ ...prev, email: e.target.value }))
        }
        placeholder="you@example.com"
      />
      <Input
        id="password"
        type="password"
        label="Password"
        autoComplete="current-password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials((prev) => ({ ...prev, password: e.target.value }))
        }
        placeholder="Your password"
      />
      <Button type="submit" block size="lg" className="mt-1">
        Sign in
      </Button>
    </form>
  );
}
