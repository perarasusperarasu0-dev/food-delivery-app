import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-6">
      <h1 className="text-3xl mb-6 text-center">Create your account</h1>
      <form onSubmit={handleSubmit} className="ticket p-6 border border-surface2 flex flex-col gap-4">
        {error && <p className="text-chili text-sm">{error}</p>}
        <input name="name" required placeholder="Full name" value={form.name} onChange={handleChange}
          className="bg-ink border border-surface2 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chili" />
        <input name="email" type="email" required placeholder="Email" value={form.email} onChange={handleChange}
          className="bg-ink border border-surface2 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chili" />
        <input name="password" type="password" required minLength={6} placeholder="Password (min 6 chars)" value={form.password} onChange={handleChange}
          className="bg-ink border border-surface2 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chili" />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}
          className="bg-ink border border-surface2 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chili" />
        <input name="address" placeholder="Delivery address" value={form.address} onChange={handleChange}
          className="bg-ink border border-surface2 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chili" />
        <button type="submit" className="bg-chili text-ink font-semibold rounded-full py-2 hover:brightness-110 transition">
          Create account
        </button>
        <p className="text-sm text-muted text-center">
          Already have an account? <Link to="/login" className="text-herb hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}
