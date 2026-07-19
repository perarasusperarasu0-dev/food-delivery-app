import { useEffect, useState } from "react";
import api from "../api/axios.js";
import MenuCard from "../components/MenuCard.jsx";

export default function Home() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/menu").then((res) => {
      setItems(res.data);
      setLoading(false);
    });
  }, []);

  const categories = ["all", ...new Set(items.map((i) => i.category))];
  const filtered = category === "all" ? items : items.filter((i) => i.category === category);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <header className="mb-10">
        <p className="text-herb uppercase tracking-widest text-xs mb-2">Open until 2am</p>
        <h1 className="text-4xl md:text-5xl mb-3">Tonight's menu</h1>
        <p className="text-muted max-w-xl">
          Late-night eats from the neighborhood's best kitchens, delivered hot to your door.
        </p>
      </header>

      <div className="flex gap-2 mb-8 flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              category === c
                ? "bg-chili text-ink border-chili"
                : "border-surface2 text-muted hover:border-chili hover:text-cream"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted">Loading menu…</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted">No dishes here yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <MenuCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
