import useSignUp from "../../hooks/useSignUp";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { SignUpCredentials } from "../../types";

interface FieldConfig {
  key: keyof SignUpCredentials;
  type: string;
  placeholder: string;
  label: string;
  required: boolean;
  autoComplete?: string;
}

const fields: FieldConfig[] = [
  { key: "email", type: "email", placeholder: "you@example.com", label: "Email", required: true, autoComplete: "email" },
  { key: "firstName", type: "text", placeholder: "First name", label: "First name", required: true, autoComplete: "given-name" },
  { key: "lastName", type: "text", placeholder: "Last name (optional)", label: "Last name", required: false, autoComplete: "family-name" },
  { key: "password", type: "password", placeholder: "Choose a password", label: "Password", required: true, autoComplete: "new-password" },
  { key: "confirmPassword", type: "password", placeholder: "Repeat your password", label: "Confirm password", required: true, autoComplete: "new-password" },
];

export default function SignUpForm() {
  const { credentials, setCredentials, signUp } = useSignUp();
  return (
    <form className="flex flex-col gap-4" onSubmit={signUp}>
      {fields.map(({ key, label, type, placeholder, required, autoComplete }) => (
        <Input
          key={key}
          id={key}
          label={label}
          type={type}
          value={credentials[key]}
          onChange={(e) =>
            setCredentials((prev) => ({ ...prev, [key]: e.target.value }))
          }
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
        />
      ))}
      <Button type="submit" block size="lg" className="mt-1">
        Create account
      </Button>
    </form>
  );
}
