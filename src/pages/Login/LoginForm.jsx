export default function LoginForm({
  credentials,
  setCredentials,
  login,
}) {
  return (
    <form onSubmit={login} className="flex flex-col">
      <input
        type="email"
        value={credentials.email}
        onChange={(e) => setCredentials(prev => ({...prev, email: e.target.value}))}
        placeholder="Enter Email"
      ></input>
      <input
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
        placeholder="Enter Password"
      ></input>
      <button type="submit">Login</button>
    </form>
  );
}
