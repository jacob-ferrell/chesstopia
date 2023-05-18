export default function LoginForm({
  email,
  password,
  setEmail,
  setPassword,
  login,
}) {
  return (
    <form onSubmit={login} className="flex flex-col">
      <input
        type="email"
        defaultValue={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter Email"
      ></input>
      <input
        type="password"
        defaultValue={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter Password"
      ></input>
      <button type="submit">Login</button>
    </form>
  );
}
