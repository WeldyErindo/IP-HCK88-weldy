export default function CategoryPills({ categories = [], active, onChange }) {
  return (
    <div className="d-flex flex-wrap gap-2 mb-3">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`btn btn-sm rounded-pill ${active === cat ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => onChange?.(cat)}
        >
          {cat.toLowerCase()}
        </button>
      ))}
    </div>
  );
}
