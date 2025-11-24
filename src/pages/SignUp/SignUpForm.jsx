import { useState } from "react";
import useSignUp from "../../hooks/useSignUp";

export default function SignUpForm() {
  const [inputMap] = useState({
    email: {
      type: "email",
      onChange: () => {},
      placeholder: "Enter your email",
      label: "Email",
      required: true,
    },
    firstName: {
      type: "text",
      onChange: () => {},
      placeholder: "Enter your first name",
      label: "First Name",
      required: true,
    },
    lastName: {
      type: "text",
      onChange: () => {},
      placeholder: "Enter your first name",
      label: "Last Name",
      required: false,
    },
    password: {
      type: "password",
      onChange: () => {},
      placeholder: "Enter your chosen password",
      label: "Password",
      required: true,
    },
    confirmPassword: {
      type: "password",
      onChange: () => {},
      placeholder: "Confirm your chosen password",
      label: "Confirm Password",
      required: true,
    },
  });
  const { credentials, setCredentials, signUp } = useSignUp();
  return (
    <form className="flex flex-col gap-6" onSubmit={signUp}>
      {Object.keys(inputMap).map((key) => {
        const { label, type, onChange, placeholder, required } = inputMap[key];
        return (
          <div key={`k-${key}`} className="flex flex-col">
            <label htmlFor={key}>{label}</label>
            <input
              value={credentials[key]}
              type={type}
              onChange={(e) =>
                setCredentials((prev) => ({ ...prev, [key]: e.target.value }))
              }
              placeholder={placeholder}
              id={key}
              required={required}
              className="rounded bg-gray-100 text-gray-900 px-2 py-1"
            />
          </div>
        );
      })}
      <button
        type="submit"
        className="bg-gradient-to-b from-lime-900 to-lime-700 hover:brightness-125 font-medium text-gray-100 shadow rounded py-2"
      >
        Submit
      </button>
    </form>
  );
}
