import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Cart() {
  const { items, updateQuantity, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl mb-8">Your cart</h1>
      {items.length === 0 ? (
        <p className="text-muted">Your cart is empty. <Link to="/" className="text-herb hover:underline">Browse the menu</Link>.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((i) => (
            <div key={i.menuItem} className="ticket p-4 border border-surface2 flex items-center justify-between">
              <div>
                <p className="font-semibold">{i.name}</p>
                <p className="text-sm text-muted">${i.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => updateQuantity(i.menuItem, i.quantity - 1)} className="w-7 h-7 rounded-full bg-surface2 hover:bg-chili hover:text-ink transition">−</button>
                <span className="w-6 text-center">{i.quantity}</span>
                <button onClick={() => updateQuantity(i.menuItem, i.quantity + 1)} className="w-7 h-7 rounded-full bg-surface2 hover:bg-chili hover:text-ink transition">+</button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-dashed border-surface2 pt-4 mt-2">
            <span className="text-lg">Total</span>
            <span className="text-lg font-display text-chili">${totalAmount.toFixed(2)}</span>
          </div>

          <button
            onClick={() => (user ? navigate("/checkout") : navigate("/login"))}
            className="bg-chili text-ink font-semibold rounded-full py-3 mt-4 hover:brightness-110 transition"
          >
            {user ? "Proceed to checkout" : "Log in to checkout"}
          </button>
        </div>
      )}
    </div>
  );
}
