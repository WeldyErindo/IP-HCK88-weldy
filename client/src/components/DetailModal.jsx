export default function DetailModal({ open, meal, onClose }) {
  if (!open) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
      <div className="modal-dialog modal-xl">
        <div className="modal-content recipe-modal">
          <div className="modal-header">
            <h5 className="modal-title">{meal?.title || "Recipe Detail"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {!meal ? (
              <p className="text-muted m-0">Loading…</p>
            ) : (
              <div className="container-fluid">
                <div className="row g-4">
                  <div className="col-12 col-md-5">
                    <div className="ratio ratio-4x3">
                      <img src={meal.thumb} alt={meal.title} className="w-100 h-100 object-fit-cover rounded" />
                    </div>
                  </div>
                  <div className="col-12 col-md-7">
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {meal.category && <span className="badge text-bg-success">{meal.category}</span>}
                      {meal.area && <span className="badge text-bg-secondary">{meal.area}</span>}
                      {meal.tags?.map((t) => <span key={t} className="badge text-bg-light border">{t}</span>)}
                    </div>

                    <h6 className="fw-semibold mt-2">Ingredients</h6>
                    <ul className="list-unstyled row row-cols-1 row-cols-md-2 g-2">
                      {meal.ingredients?.map((it, i) => (
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
                <h6 className="fw-semibold">Instructions</h6>
                <p className="mb-0" style={{ whiteSpace: "pre-line" }}>{meal.instructions}</p>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </div>
  );
}
