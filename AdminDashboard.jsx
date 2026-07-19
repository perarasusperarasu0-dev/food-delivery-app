import { useEffect, useState } from "react";
import api from "../api/axios.js";

const emptyForm = { name: "", description: "", price: "", category: "", imageUrl: "", isAvailable: true };

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("menu");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadMenu = () => api.get("/menu").then((res) => setItems(res.data));
  const loadOrders = () => api.get("/orders").then((res) => setOrders(res.data));

  useEffect(() => { loadMenu(); loadOrders(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, price: parseFloat(form.price) };
      if (editingId) {
        await api.put(`/menu/${editingId}`, payload);
      } else {
        await api.post("/menu", payload);
      }
      resetForm();
      loadMenu();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const handleEdit = (item) => {
    setForm({ ...item, price: item.price.toString() });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    await api.delete(`/menu/${id}`);
    loadMenu();
  };

  const handleStatusChange = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    loadOrders();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl mb-6">Admin dashboard</h1>

      <div className="flex gap-2 mb-8">
        {["menu", "orders"].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition capitalize ${
              tab === t ? "bg-chili text-ink border-chili" : "border-surface2 text-muted hover:text-cream"
            }`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "menu" && (
        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="ticket p-6 border border-surface2 flex flex-col gap-3 h-fit">
            <h2 className="text-xl mb-2">{editingId ? "Edit item" : "Add new item"}</h2>
            {error && <p className="text-chili text-sm">{error}</p>}
            <input name="name" placeholder="Name" required value={form.name} onChange={handleChange}
              className="bg-ink border border-surface2 rounded-lg px-4 py-2" />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange}
              className="bg-ink border border-surface2 rounded-lg px-4 py-2" />
            <input name="price" type="number" step="0.01" min="0" placeholder="Price" required value={form.price} onChange={handleChange}
              className="bg-ink border border-surface2 rounded-lg px-4 py-2" />
            <input name="category" placeholder="Category (e.g. Noodles)" required value={form.category} onChange={handleChange}
              className="bg-ink border border-surface2 rounded-lg px-4 py-2" />
            <input name="imageUrl" placeholder="Image URL (optional)" value={form.imageUrl} onChange={handleChange}
              className="bg-ink border border-surface2 rounded-lg px-4 py-2" />
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} />
              Available
            </label>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-chili text-ink font-semibold rounded-full py-2 px-5 hover:brightness-110 transition">
                {editingId ? "Save changes" : "Add item"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="text-muted hover:text-cream text-sm">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item._id} className="ticket p-4 border border-surface2 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-muted">{item.category} · ${item.price.toFixed(2)} · {item.isAvailable ? "available" : "sold out"}</p>
                </div>
                <div className="flex gap-3 text-sm">
                  <button onClick={() => handleEdit(item)} className="text-herb hover:underline">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="text-chili hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="flex flex-col gap-4">
          {orders.map((o) => (
            <div key={o._id} className="ticket p-5 border border-surface2 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-semibold">{o.user?.name} <span className="text-muted text-xs">({o.user?.email})</span></p>
                <p className="text-xs text-muted">{new Date(o.createdAt).toLocaleString()} · ${o.totalAmount.toFixed(2)} · {o.paymentStatus}</p>
              </div>
              <select
                value={o.status}
                onChange={(e) => handleStatusChange(o._id, e.target.value)}
                className="bg-ink border border-surface2 rounded-lg px-3 py-1.5 text-sm"
              >
                {["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"].map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
