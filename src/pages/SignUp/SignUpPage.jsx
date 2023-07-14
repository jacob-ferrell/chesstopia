import SignUpForm from "./SignUpForm";

export default function SignUpPage() {
  return (
    <div className="w-full max-w-xl flex flex-col gap-6">
      <h2 className="text-gray-100 font-medium text-3xl">Sign Up</h2>
      <SignUpForm />
    </div>
  );
}
