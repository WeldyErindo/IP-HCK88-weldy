import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE = (import.meta.env.VITE_MEALDB_BASE || "https://www.themealdb.com").replace(/\/+$/, "");
const API_KEY  = import.meta.env.VITE_MEALDB_KEY || "1";
const BASE = `${API_BASE}/api/json/v1/${API_KEY}`;

async function fetchDetailFromMealDB(id) {
  try {
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
      source: 'themealdb'
    };
  } catch (error) {
    console.error('Error fetching from TheMealDB:', error);
    return null;
  }
}

async function fetchDetailFromDB(id) {
  try {
    const { data } = await axios.get(`http://localhost:4000/apis/recipes/${id}`);
    
   
    const ingredients = Array.isArray(data.ingredients) 
      ? data.ingredients.map(ing => typeof ing === 'string' 
        ? { ingredient: ing, measure: '' }
        : { ingredient: ing.ingredient || ing, measure: ing.measure || '' })
      : [];

    return {
      id: data.id,
      title: data.title,
      category: data.Category?.name || 'Uncategorized',
      area: data.area || 'User Recipe',
      thumb: data.thumbnail || data.image,
      youtube: null,
      instructions: data.instructions,
      ingredients,
      tags: [],
      source: 'user',
      durationMinutes: data.durationMinutes,
      sourceUrl: data.sourceUrl,
      author: data.User?.name || data.User?.email || 'Anonymous'
    };
  } catch (error) {
    
    if (error.response?.status === 404) {
      console.log('Recipe not found in database, will try TheMealDB');
    } else {
      console.error('Error fetching recipe from DB:', error);
    }
    return null;
  }
}

export default function MealDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
 
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      Swal.fire({
        title: "Login Required",
        text: "You need to login or register to view recipe details",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Register",
        reverseButtons: true,
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          navigate("/register");
        } else {
          navigate("/");
        }
      });
      return;
    }

    window.scrollTo(0, 0);
    (async () => {
      setLoading(true);
      
      try {
        let d = null;
        
      
        if (id && id.toString().startsWith('db-')) {
          const dbId = id.replace('db-', '');
          d = await fetchDetailFromDB(dbId);
        } else {
        
          const numericId = Number(id);
          const isLikelyUserRecipe = !isNaN(numericId) && numericId < 10000;
          
          if (isLikelyUserRecipe) {
            
            d = await fetchDetailFromDB(id);
          
            if (!d) {
              d = await fetchDetailFromMealDB(id);
            }
          } else {
            
            d = await fetchDetailFromMealDB(id);
            
            
            if (!d && !isNaN(numericId)) {
              d = await fetchDetailFromDB(id);
            }
          }
        }
        
        setMeal(d);
      } catch (error) {
        console.error('Error loading recipe:', error);
        setMeal(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

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
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <button className="btn btn-outline-secondary mb-3 rounded-pill px-4" onClick={() => navigate(-1)}>
            ← Back
          </button>
          
          {meal.source === 'user' && (
            <div className="alert alert-success d-flex align-items-center mb-3 rounded-4" role="alert">
              <span className="me-2" style={{ fontSize: '24px' }}>✨</span>
              <div>
                <strong>User Recipe</strong>
                {meal.author && <span className="ms-2">by {meal.author}</span>}
              </div>
            </div>
          )}
          
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
            <div className="card-body p-4 p-md-5">
              <h1 className="mb-4 fw-bold" style={{ fontSize: '2rem' }}>
                <span style={{ fontSize: '30px' }}>🍽️</span> {meal.title}
              </h1>

              <div className="row g-4">
           
                <div className="col-12 col-md-6">
                  <div className="ratio ratio-16x9 rounded-4 overflow-hidden shadow-sm">
                    <img src={meal.thumb} alt={meal.title} className="w-100 h-100 object-fit-cover" />
                  </div>
                  
             
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {meal.category && (
                      <span className="badge px-3 py-2" style={{ background: '#23C55E', color: 'white', fontSize: '14px' }}>
                        🏷️ {meal.category}
                      </span>
                    )}
                    {meal.area && (
                      <span className="badge bg-secondary px-3 py-2" style={{ fontSize: '14px' }}>
                        🌍 {meal.area}
                      </span>
                    )}
                    {meal.durationMinutes && (
                      <span className="badge bg-info px-3 py-2" style={{ fontSize: '14px' }}>
                        ⏱️ {meal.durationMinutes} min
                      </span>
                    )}
                    {meal.tags?.map((t) => (
                      <span key={t} className="badge bg-light text-dark border px-3 py-2" style={{ fontSize: '14px' }}>
                        {t}
                      </span>
                    ))}
                  </div>

         
                  <div className="mt-3 d-flex flex-wrap gap-2">
                    {(meal.youtube || meal.sourceUrl) && (
                      <>
                        {meal.youtube && (
                          <a 
                            className="btn btn-danger rounded-pill px-4" 
                            href={meal.youtube} 
                            target="_blank" 
                            rel="noreferrer"
                            style={{
                              background: '#FF0000',
                              border: 'none',
                              transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = '#CC0000';
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 12px rgba(255,0,0,0.3)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = '#FF0000';
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = 'none';
                            }}
                          >
                            📺 Watch on YouTube
                          </a>
                        )}
                        
                        {meal.sourceUrl && !meal.youtube && (
                          <a 
                            className="btn btn-danger rounded-pill px-4" 
                            href={meal.sourceUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            style={{
                              background: '#FF0000',
                              border: 'none',
                              transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = '#CC0000';
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 12px rgba(255,0,0,0.3)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = '#FF0000';
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = 'none';
                            }}
                          >
                            📺 Watch on YouTube
                          </a>
                        )}
                        
                        {meal.sourceUrl && meal.youtube && (
                          <a 
                            className="btn btn-outline-primary rounded-pill px-4" 
                            href={meal.sourceUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            style={{ transition: 'all 0.3s' }}
                            onMouseOver={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 12px rgba(0,123,255,0.3)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = 'none';
                            }}
                          >
                            🔗 View Source
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>

             
                <div className="col-12 col-md-6">
                  <div className="bg-light rounded-4 p-4">
                    <h5 className="fw-bold mb-3" style={{ color: '#333' }}>
                      <span style={{ fontSize: '24px' }}>🥗</span> Ingredients
                    </h5>
                    <ul className="list-group list-group-flush">
                      {meal.ingredients.map((it, i) => (
                        <li key={i} className="list-group-item bg-transparent border-0 px-0 py-2">
                          <span className="fw-semibold" style={{ color: '#23C55E' }}>•</span>{' '}
                          <span className="fw-semibold">{it.ingredient}</span>
                          {it.measure && <span className="text-muted"> — {it.measure}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

        
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="card-body p-4 p-md-5">
              <h5 className="fw-bold mb-4" style={{ color: '#333' }}>
                <span style={{ fontSize: '24px' }}>📋</span> Instructions
              </h5>
              <div className="recipe-instructions" style={{ 
                whiteSpace: "pre-line", 
                lineHeight: '1.8',
                fontSize: '16px',
                color: '#555'
              }}>
                {meal.instructions}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
