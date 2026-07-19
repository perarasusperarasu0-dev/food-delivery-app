import { useEffect, useState } from "react";
import api from "../api/axios.js";

const statusColor = {
  pending: "text-muted",
  confirmed: "text-herb",
  preparing: "text-chili",
  out_for_delivery: "text-chili",
  delivered: "text-herb",
  cancelled: "text-red-500",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/mine").then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  const cancelOrder = async (id) => {
    await api.delete(`/orders/${id}`);
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status: "cancelled" } : o)));
  };

  if (loading) return <p className="max-w-3xl mx-auto px-6 py-10 text-muted">Loading orders…</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl mb-8">My orders</h1>
      {orders.length === 0 ? (
        <p className="text-muted">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((o) => (
            <div key={o._id} className="ticket p-5 border border-surface2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted">
                  {new Date(o.createdAt).toLocaleString()}
                </span>
                <span className={`text-sm font-semibold capitalize ${statusColor[o.status]}`}>
                  {o.status.replace(/_/g, " ")}
                </span>
              </div>
              <ul className="text-sm text-cream mb-3">
                {o.items.map((it, idx) => (
                  <li key={idx}>{it.quantity}× {it.name}</li>
                ))}
              </ul>
              <div className="border-t border-dashed border-surface2 pt-3 flex items-center justify-between">
                <span className="text-xs text-muted">{o.paymentStatus === "paid" ? "Paid" : "Unpaid"}</span>
                <span className="font-display text-chili">${o.totalAmount.toFixed(2)}</span>
              </div>
              {o.status === "pending" && (
                <button onClick={() => cancelOrder(o._id)} className="text-xs text-muted hover:text-chili mt-3 underline">
                  Cancel order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
