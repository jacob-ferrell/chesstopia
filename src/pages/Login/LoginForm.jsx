export default function LoginForm({ credentials, setCredentials, login }) {
  return (
    <form onSubmit={login} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-gray-100">
          Email
        </label>
        <input
          type="email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="Enter Email"
          className="rounded bg-gray-100 text-gray-900 px-2 py-1"
          id="email"
        ></input>
        <label htmlFor="password" className="text-gray-100">
          Password
        </label>
        <input
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials((prev) => ({ ...prev, password: e.target.value }))
          }
          placeholder="Enter Password"
          className="rounded bg-gray-100 text-gray-900 px-2 py-1"
          id="password"
        ></input>
      </div>
      <button type="submit" className="bg-gradient-to-b from-lime-900 to-lime-700 hover:brightness-125 font-medium text-gray-100 shadow rounded py-2">Login</button>
    </form>
  );
}
