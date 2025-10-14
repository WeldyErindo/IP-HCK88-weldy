import { useNavigate } from "react-router";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-md bg-white border-bottom shadow-sm">
      <div className="container">
        <button className="navbar-brand fw-bold btn btn-link p-0" onClick={() => navigate("/")}>
          Recipely
        </button>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navRecipely">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navRecipely">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => navigate("/")}>Home</button>
            </li>
          </ul>
          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={() => navigate("/register")}>Register</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
