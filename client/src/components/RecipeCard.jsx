import { useNavigate } from "react-router";

export default function RecipeCard({ meal }) {
  const navigate = useNavigate();
  const goDetail = (e) => {
    e?.stopPropagation?.();       
    navigate(`/meal/${meal.id}`);
  };

  return (
    <article
      className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden"
      role="button"
      tabIndex={0}
      onClick={goDetail}
      onKeyDown={(e) => (e.key === "Enter" ? goDetail(e) : null)}
      style={{ cursor: "pointer", position: "relative", zIndex: 0 }}
    >
      <div className="position-relative">
        <div className="ratio ratio-16x9">
          <img
            src={meal.thumb}
            alt={meal.title}
            className="w-100 h-100 object-fit-cover"
          />
        </div>

      
        {meal.category && (
          <span
            className="position-absolute top-0 start-0 m-2 badge badge-chip text-white px-3 py-2 rounded-pill"
            style={{ pointerEvents: "none" }}
          >
            {meal.category.toLowerCase()}
          </span>
        )}
      </div>

      <div className="card-body">
        <h6 className="card-title mb-1 text-truncate" title={meal.title}>
          {meal.title}
        </h6>
        <p className="text-muted small mb-3">{meal.area || "–"}</p>

        <button
          type="button"
          className="btn btn-primary w-100 rounded-pill py-2 mt-2 position-relative"
          onClick={goDetail}
          style={{ zIndex: 2 }}
        >
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white text-primary me-1"
            style={{ width: 28, height: 28, fontWeight: 700 }}
          >
            +
          </span>
          <span className="fw-semibold">Read More</span>
          <span className="ms-1">→</span>
        </button>
      </div>
    </article>
  );
}
