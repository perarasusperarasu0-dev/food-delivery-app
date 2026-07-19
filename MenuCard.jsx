import { useCart } from "../context/CartContext.jsx";

export default function MenuCard({ item }) {
  const { addItem } = useCart();

  return (
    <div className="ticket p-5 flex flex-col gap-3 border border-surface2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-cream">{item.name}</h3>
          <p className="text-sm text-muted mt-1">{item.description}</p>
        </div>
        <span className="font-display text-chili text-lg whitespace-nowrap">
          ${item.price.toFixed(2)}
        </span>
      </div>
      <div className="border-t border-dashed border-surface2 pt-3 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-muted">{item.category}</span>
        <button
          onClick={() => addItem(item)}
          disabled={!item.isAvailable}
          className="bg-herb text-ink text-sm font-semibold px-4 py-1.5 rounded-full hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {item.isAvailable ? "Add to cart" : "Sold out"}
        </button>
      </div>
    </div>
  );
}
