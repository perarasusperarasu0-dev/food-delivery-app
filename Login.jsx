import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-6">
      <h1 className="text-3xl mb-6 text-center">Welcome back</h1>
      <form onSubmit={handleSubmit} className="ticket p-6 border border-surface2 flex flex-col gap-4">
        {error && <p className="text-chili text-sm">{error}</p>}
        <input
          type="email" required placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-ink border border-surface2 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chili"
        />
        <input
          type="password" required placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-ink border border-surface2 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chili"
        />
        <button type="submit" className="bg-chili text-ink font-semibold rounded-full py-2 hover:brightness-110 transition">
          Log in
        </button>
        <p className="text-sm text-muted text-center">
          No account? <Link to="/register" className="text-herb hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
}
