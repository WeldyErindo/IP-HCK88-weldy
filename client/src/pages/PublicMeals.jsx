import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar.jsx";
import CategoryPills from "../components/CategoryPills.jsx";
import RecipeCard from "../components/RecipeCard.jsx";

const API_BASE = (import.meta.env.VITE_MEALDB_BASE || "https://www.themealdb.com").replace(/\/+$/, "");
const API_KEY  = import.meta.env.VITE_MEALDB_KEY || "1";
const BASE = `${API_BASE}/api/json/v1/${API_KEY}`;

async function fetchCardsAZ() {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const pages = await Promise.all(
    letters.map(async (l) => {
      try {
        const r = await fetch(`${BASE}/search.php?f=${l}`);
        return await r.json();
      } catch {
        return { meals: null };
      }
    })
  );


  const map = new Map();
  for (const page of pages) {
    (page.meals || []).forEach((m) => {
      map.set(m.idMeal, {
        id: m.idMeal,
        title: m.strMeal,
        thumb: m.strMealThumb,
        category: m.strCategory,
        area: m.strArea,
      });
    });
  }
  return Array.from(map.values());
}

function paginate(arr, page = 1, limit = 12) {
  const total = arr.length;
  const totalPage = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  return { items: arr.slice(start, start + limit), page, limit, total, totalPage };
}

export default function PublicMeals() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchCardsAZ();
      setCards(data);
      setLoading(false);
    })();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(cards.map((m) => m.category).filter(Boolean));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [cards]);

  const filtered = useMemo(() => {
    const s = query.trim().toLowerCase();
    return cards.filter((m) => {
      const okCat = activeCat === "All" || m.category === activeCat;
      const okText =
        !s ||
        m.title.toLowerCase().includes(s) ||
        (m.category || "").toLowerCase().includes(s) ||
        (m.area || "").toLowerCase().includes(s);
      return okCat && okText;
    });
  }, [cards, activeCat, query]);

  useEffect(() => setPage(1), [activeCat, query]);

  const { items, total, totalPage } = useMemo(
    () => paginate(filtered, page, limit),
    [filtered, page]
  );

  function handleGemini(q) {
    alert(`Gemini will search for: "${q || "(empty)"}"`);
  }

  return (
    <div className="container py-4">
      <section className="bg-light rounded-4 p-4 p-md-5 shadow-sm mb-4">
        <div className="row align-items-center g-4">
          <div className="col-md-8">
            <span className="badge text-bg-light border">★ Discover</span>
            <h1 className="display-6 fw-bold mt-2 mb-2">Find, Cook, Enjoy.</h1>
            <p className="text-muted mb-3">Browse public recipes from TheMealDB.</p>
            <SearchBar value={query} onChange={setQuery} onGemini={handleGemini} />
          </div>
          <div className="col-md-4 d-flex justify-content-md-end">
            <div className="bg-white border rounded-pill px-3 py-2 d-inline-flex align-items-center shadow-sm">
              <span className="me-2">Total Recipes</span>
              <span className="badge rounded-pill text-bg-primary fs-6">{total}</span>
            </div>
          </div>
        </div>
      </section>

      <CategoryPills categories={categories} active={activeCat} onChange={setActiveCat} />

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : (
        <div className="row g-3">
          {items.map((m) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={m.id}>
              <RecipeCard meal={m} />
            </div>
          ))}
        </div>
      )}

      {!loading && totalPage > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Prev
              </button>
            </li>
            {Array.from({ length: totalPage }).map((_, i) => {
              const p = i + 1;
              return (
                <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                </li>
              );
            })}
            <li className={`page-item ${page === totalPage ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage((p) => Math.min(totalPage, p + 1))}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
