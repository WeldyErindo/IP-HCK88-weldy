import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const API_BASE = (import.meta.env.VITE_MEALDB_BASE || "https://www.themealdb.com").replace(/\/+$/, "");
const API_KEY  = import.meta.env.VITE_MEALDB_KEY || "1";
const BASE = `${API_BASE}/api/json/v1/${API_KEY}`;

async function fetchDetail(id) {
  const r = await fetch(`${BASE}/lookup.php?i=${id}`);
  const data = await r.json();
  const m = (data.meals || [])[0];
  if (!m) return null;

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = m[`strIngredient${i}`];
    const meas = m[`strMeasure${i}`];
    if (ing && String(ing).trim()) {
      ingredients.push({ ingredient: ing, measure: meas || "" });
    }
  }
  const tags = (m.strTags || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    id: m.idMeal,
    title: m.strMeal,
    category: m.strCategory,
    area: m.strArea,
    thumb: m.strMealThumb,
    youtube: m.strYoutube,
    instructions: m.strInstructions,
    ingredients,
    tags,
  };
}

export default function MealDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      setLoading(true);
      const d = await fetchDetail(id);
      setMeal(d);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="container py-4"><p className="text-muted">Loading…</p></div>;
  if (!meal) {
    return (
      <div className="container py-4">
        <p className="text-danger">Recipe not found.</p>
        <button className="btn btn-outline-secondary mt-2" onClick={() => navigate(-1)}>← Back</button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>← Back</button>
      <h2 className="mb-3">{meal.title}</h2>

      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="ratio ratio-16x9">
            <img src={meal.thumb} alt={meal.title} className="w-100 h-100 object-fit-cover rounded" />
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="d-flex flex-wrap gap-2 mb-2">
            {meal.category && <span className="badge text-bg-success">{meal.category}</span>}
            {meal.area && <span className="badge text-bg-secondary">{meal.area}</span>}
            {meal.tags?.map((t) => <span key={t} className="badge text-bg-light border">{t}</span>)}
          </div>

          <h5 className="fw-semibold mt-2">Ingredients</h5>
          <ul className="list-unstyled row row-cols-1 row-cols-md-2 g-2">
            {meal.ingredients.map((it, i) => (
              <li key={i} className="col">
                <span className="fw-semibold">{it.ingredient}</span>
                {it.measure ? <> — <span className="text-muted">{it.measure}</span></> : null}
              </li>
            ))}
          </ul>

          {meal.youtube && (
            <a className="btn btn-danger btn-sm mt-2" href={meal.youtube} target="_blank" rel="noreferrer">
              Watch on YouTube
            </a>
          )}
        </div>
      </div>

      <hr className="my-4" />
      <h5 className="fw-semibold">Instructions</h5>
      <p style={{ whiteSpace: "pre-line" }}>{meal.instructions}</p>
    </div>
  );
}
