import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <nav className="sticky top-0 z-10 bg-ink/95 backdrop-blur border-b border-surface2 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="font-display text-2xl font-semibold text-cream tracking-tight">
        Night<span className="text-chili">market</span>
      </Link>
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/" className="hover:text-chili transition-colors">Menu</Link>
        {user && (
          <Link to="/orders" className="hover:text-chili transition-colors">My Orders</Link>
        )}
        {user?.role === "admin" && (
          <Link to="/admin" className="hover:text-chili transition-colors">Admin</Link>
        )}
        <Link to="/cart" className="hover:text-chili transition-colors relative">
          Cart
          {count > 0 && (
            <span className="absolute -top-2 -right-3 bg-chili text-ink text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {count}
            </span>
          )}
        </Link>
        {user ? (
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="text-muted hover:text-chili transition-colors"
          >
            Log out
          </button>
        ) : (
          <Link to="/login" className="bg-chili text-ink px-4 py-2 rounded-full font-semibold hover:brightness-110 transition">
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}
