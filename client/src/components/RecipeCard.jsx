import { useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function RecipeCard({ meal }) {
  const navigate = useNavigate();
  
  const goDetail = (e) => {
    e?.stopPropagation?.();
    
   
    const token = localStorage.getItem("access_token");
    
    if (!token) {
     
      Swal.fire({
        title: "Login Required",
        text: "You need to login or register to view recipe details",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Register",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          navigate("/register");
        }
      });
      return;
    }
    
   
    if (meal.source === 'user') {
      navigate(`/meal/${meal.recipeId}`);
    } else {
      navigate(`/meal/${meal.id}`);
    }
  };

  return (
    <>
      <style>
        {`
          .recipe-card {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }
          .recipe-card:hover {
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3) !important;
          }
          .recipe-card-img-wrapper {
            position: relative;
            overflow: hidden;
          }
          .recipe-card-img {
            transition: transform 0.6s ease;
          }
          .recipe-card:hover .recipe-card-img {
            transform: scale(1.1) rotate(2deg);
          }
          .recipe-card-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%);
            opacity: 0;
            transition: opacity 0.3s;
          }
          .recipe-card:hover .recipe-card-overlay {
            opacity: 1;
          }
          .recipe-card-badge {
            transition: all 0.3s;
          }
          .recipe-card:hover .recipe-card-badge {
            transform: scale(1.1);
          }
          .recipe-card-btn {
            transition: all 0.3s;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            position: relative;
            overflow: hidden;
          }
          .recipe-card-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
          }
          .recipe-card-btn:hover::before {
            width: 300px;
            height: 300px;
          }
          .recipe-card-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
          }
        `}
      </style>
      
      <article
        className="card h-100 border-0 shadow recipe-card rounded-4"
        role="button"
        tabIndex={0}
        onClick={goDetail}
        onKeyDown={(e) => (e.key === "Enter" ? goDetail(e) : null)}
      >
        <div className="recipe-card-img-wrapper">
          <div className="ratio ratio-4x3">
            <img
              src={meal.thumb}
              alt={meal.title}
              className="w-100 h-100 object-fit-cover recipe-card-img"
            />
          </div>
          
          <div className="recipe-card-overlay"></div>

          {meal.source === 'user' && (
            <span
              className="position-absolute top-0 end-0 m-2 badge text-white px-3 py-2 rounded-pill recipe-card-badge shadow"
              style={{ 
                pointerEvents: "none",
                background: 'linear-gradient(135deg, #23C55E 0%, #1ea34d 100%)',
                fontWeight: '600'
              }}
            >
              ✨ Community
            </span>
          )}
        
          {meal.category && (
            <span
              className="position-absolute top-0 start-0 m-2 badge text-white px-3 py-2 rounded-pill recipe-card-badge shadow"
              style={{ 
                pointerEvents: "none",
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                fontWeight: '600'
              }}
            >
              🏷️ {meal.category}
            </span>
          )}
        </div>

        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-bold mb-2" style={{ 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '3em',
            color: '#2d3748'
          }}>
            {meal.title}
          </h5>
          
          <div className="d-flex align-items-center gap-2 mb-3">
            <span style={{ fontSize: '16px' }}>🌍</span>
            <span className="text-muted small fw-semibold">{meal.area || "International"}</span>
          </div>

          <button
            type="button"
            className="btn btn-primary w-100 rounded-pill py-2 mt-auto recipe-card-btn"
            onClick={goDetail}
            style={{ zIndex: 2, position: 'relative' }}
          >
            <span className="fw-semibold position-relative" style={{ zIndex: 1 }}>
              📖 View Recipe
            </span>
          </button>
        </div>
      </article>
    </>
  );
}

