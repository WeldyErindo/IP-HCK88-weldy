import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
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
        source: 'themealdb'
      });
    });
  }
  return Array.from(map.values());
}

async function fetchUserRecipes() {
  try {
    const { data } = await axios.get("http://localhost:4000/apis/recipes");
    return data.map(recipe => ({
      id: `db-${recipe.id}`, 
      title: recipe.title,
      thumb: recipe.thumbnail || recipe.image,
      category: recipe.Category?.name || 'Uncategorized',
      area: 'User Recipe',
      source: 'user',
      recipeId: recipe.id 
    }));
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    return [];
  }
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
  const [refreshKey, setRefreshKey] = useState(0);
  const [geminiRecipe, setGeminiRecipe] = useState(null);
  const [geminiLoading, setGeminiLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [mealDBRecipes, userRecipes] = await Promise.all([
        fetchCardsAZ(),
        fetchUserRecipes()
      ]);
     
      setCards([...userRecipes, ...mealDBRecipes]);
      setLoading(false);
    })();
  }, [refreshKey]); 


  useEffect(() => {
    const handleRecipeAdded = () => {
      setRefreshKey(prev => prev + 1);
    };
    
    window.addEventListener("recipeAdded", handleRecipeAdded);
    
    return () => {
      window.removeEventListener("recipeAdded", handleRecipeAdded);
    };
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

  async function handleGemini(q) {
    if (!q || !q.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Empty Search",
        text: "Please enter a recipe idea or ingredient to search with AI!",
        confirmButtonColor: "#667eea"
      });
      return;
    }

    setGeminiLoading(true);
    
    try {
      const { data } = await axios.post("http://localhost:4000/apis/gemini/generate", {
        query: q
      });
      
      setGeminiRecipe(data);
     
      Swal.fire({
        icon: "success",
        title: "AI Recipe Generated! ✨",
        html: `<p><strong>${data.title}</strong></p><p>Your AI-powered recipe is ready to view!</p>`,
        confirmButtonColor: "#667eea",
        confirmButtonText: "View Recipe"
      });
      
    } catch (error) {
      console.error("Gemini Error:", error);
      Swal.fire({
        icon: "error",
        title: "AI Generation Failed",
        html: error.response?.data?.error || "Failed to generate recipe. Please try again or check if API key is configured.",
        confirmButtonColor: "#667eea"
      });
    } finally {
      setGeminiLoading(false);
    }
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <div className="container py-4">
       
        <section 
          className="rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
            minHeight: '500px'
          }}
        >
        
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url("/picture/80815088c035a3enm4957c44243f00a7.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.15,
              zIndex: 0
            }}
          />

         
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ 
            opacity: 0.08,
            zIndex: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div>

          
          <div className="position-absolute d-none d-xxl-block" style={{ top: '10%', left: '5%', fontSize: '60px', opacity: 0.3, animation: 'float 6s ease-in-out infinite', zIndex: 1 }}>
            🧅
          </div>
          <div className="position-absolute d-none d-xxl-block" style={{ top: '60%', left: '8%', fontSize: '50px', opacity: 0.25, animation: 'float 5s ease-in-out infinite 1s', zIndex: 1 }}>
            🍅
          </div>
          <div className="position-absolute d-none d-lg-block" style={{ top: '15%', right: '10%', fontSize: '55px', opacity: 0.3, animation: 'float 7s ease-in-out infinite 0.5s', zIndex: 1 }}>
            🥕
          </div>
          <div className="position-absolute d-none d-lg-block" style={{ top: '70%', right: '7%', fontSize: '65px', opacity: 0.25, animation: 'float 6s ease-in-out infinite 1.5s', zIndex: 1 }}>
            🌶️
          </div>
          <div className="position-absolute d-none d-xxl-block" style={{ top: '40%', left: '12%', fontSize: '45px', opacity: 0.2, animation: 'float 8s ease-in-out infinite 2s', zIndex: 1 }}>
            🥔
          </div>
          <div className="position-absolute d-none d-xxl-block" style={{ top: '35%', right: '15%', fontSize: '50px', opacity: 0.25, animation: 'float 7s ease-in-out infinite 2.5s', zIndex: 1 }}>
            🧄
          </div>
          
          <div className="row align-items-center g-4 position-relative" style={{ zIndex: 2 }}>
            <div className="col-md-7">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge px-3 py-2" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '14px' }}>
                  ⭐ Discover Recipes
                </span>
                <div className="d-flex gap-1">
                  <span style={{ fontSize: '24px' }}>🍕</span>
                  <span style={{ fontSize: '24px' }}>🍜</span>
                  <span style={{ fontSize: '24px' }}>🍰</span>
                </div>
              </div>
              <h1 className="display-4 fw-bold text-white mb-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                Find, Cook, Enjoy! 👨‍🍳
              </h1>
              <p className="text-white mb-4 fs-5" style={{ opacity: 0.95 }}>
                Explore thousands of delicious recipes from our community and around the world
              </p>
              <SearchBar value={query} onChange={setQuery} onGemini={handleGemini} />
              
             
              <div className="d-flex flex-wrap gap-3 mt-4">
                <div 
                  className="rounded-4 px-4 py-3 d-flex align-items-center gap-3 shadow-lg"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '50px',
                      height: '50px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>📖</span>
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0" style={{ color: '#667eea', fontSize: '28px' }}>{total}</h4>
                    <p className="text-muted mb-0 small fw-semibold">Delicious Recipes ✨</p>
                  </div>
                </div>

                <div 
                  className="rounded-4 px-4 py-3 d-flex align-items-center gap-3 shadow-lg"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '50px',
                      height: '50px',
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                      boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
                      animation: 'pulse 2s ease-in-out infinite'
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>🔥</span>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0" style={{ color: '#ee5a24', fontSize: '18px' }}>Trending Now!</h5>
                    <p className="text-muted mb-0" style={{ fontSize: '12px' }}>Hot recipes 🌶️</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5 d-none d-md-block">
             
              <div className="d-flex flex-column gap-3">
              
                <div 
                  className="rounded-4 shadow-lg overflow-hidden"
                  style={{ 
                    height: '220px',
                    transform: 'rotate(-2deg)',
                    transition: 'all 0.4s',
                    backgroundImage: 'url("/picture/806ca3ed15a477b86e8f159ff5a281d5.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />

              
                <div 
                  className="rounded-4 shadow-lg overflow-hidden"
                  style={{ 
                    height: '160px',
                    transform: 'rotate(2deg)',
                    transition: 'all 0.4s',
                    backgroundImage: 'url("/picture/2f577c22a5ff5900db55d4a2227eb35d.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <span style={{ fontSize: '24px' }}>🏷️</span>
              <span>Browse by Category</span>
            </h5>
            <span className="badge bg-white text-dark border px-3 py-2">
              {categories.length} Categories
            </span>
          </div>
          <CategoryPills categories={categories} active={activeCat} onChange={setActiveCat} />
        </div>

   
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-3 fs-5">Loading delicious recipes... 🍳</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-5">
            <div className="card border-0 shadow-lg mx-auto rounded-4 overflow-hidden" style={{ maxWidth: '600px' }}>
              <div className="card-body p-5" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%)' }}>
                <div className="mb-4">
                  <div 
                    className="d-inline-block p-4 rounded-circle mb-3"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                      animation: 'float 3s ease-in-out infinite'
                    }}
                  >
                    <span style={{ fontSize: '80px' }}>🔍</span>
                  </div>
                </div>
                
                <h3 className="fw-bold mb-3" style={{ color: '#2d3748' }}>
                  No Recipes Found
                </h3>
                <p className="text-muted mb-4 fs-5">
                  {query ? `No results for "${query}"` : "Try adjusting your search or category filter"}
                </p>
                
                {query && (
                  <div 
                    className="mt-4 p-4 rounded-4 position-relative overflow-hidden"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                      border: '2px solid rgba(102, 126, 234, 0.2)'
                    }}
                  >
                    
                    <div 
                      className="position-absolute"
                      style={{
                        top: '-20px',
                        right: '-20px',
                        width: '100px',
                        height: '100px',
                        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)',
                        borderRadius: '50%'
                      }}
                    ></div>
                    <div 
                      className="position-absolute"
                      style={{
                        bottom: '-30px',
                        left: '-30px',
                        width: '120px',
                        height: '120px',
                        background: 'radial-gradient(circle, rgba(118, 75, 162, 0.2) 0%, transparent 70%)',
                        borderRadius: '50%'
                      }}
                    ></div>
                    
                    <div className="position-relative">
                      <div className="mb-3">
                        <span 
                          className="d-inline-block mb-2"
                          style={{ 
                            fontSize: '48px',
                            animation: 'bounce 2s ease-in-out infinite'
                          }}
                        >
                          🤖
                        </span>
                      </div>
                      
                      <h5 className="fw-bold mb-2" style={{ color: '#667eea' }}>
                        Let AI Create Your Recipe!
                      </h5>
                      <p className="text-muted mb-4">
                        Gemini AI can generate a custom recipe based on "{query}"
                      </p>
                      
                      <button
                        className="btn btn-lg px-5 py-3 rounded-pill text-white fw-semibold shadow-lg position-relative overflow-hidden"
                        style={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          transition: 'all 0.3s'
                        }}
                        onClick={() => handleGemini(query)}
                        disabled={geminiLoading}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1) translateY(0)';
                          e.currentTarget.style.boxShadow = '';
                        }}
                      >
                        {geminiLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Generating Recipe...
                          </>
                        ) : (
                          <>
                            <span className="me-2" style={{ fontSize: '20px' }}>✨</span>
                            Generate Recipe with AI
                            <span className="ms-2" style={{ fontSize: '20px' }}>🎨</span>
                          </>
                        )}
                      </button>
                      
                      <div className="mt-4 d-flex align-items-center justify-content-center gap-3 text-muted small">
                        <span className="d-flex align-items-center gap-1">
                          <span style={{ color: '#667eea' }}>⚡</span> Instant
                        </span>
                        <span>•</span>
                        <span className="d-flex align-items-center gap-1">
                          <span style={{ color: '#667eea' }}>🎯</span> Personalized
                        </span>
                        <span>•</span>
                        <span className="d-flex align-items-center gap-1">
                          <span style={{ color: '#667eea' }}>🌟</span> AI-Powered
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="row g-4 mb-4">
              {items.map((m) => (
                <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={m.id}>
                  <RecipeCard meal={m} />
                </div>
              ))}
            </div>

            {/* Modern Pagination */}
            {totalPage > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-3 mt-5 mb-4">
                <button
                  className="btn btn-lg rounded-circle shadow-sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    width: '50px',
                    height: '50px',
                    background: page === 1 ? '#e0e0e0' : '#667eea',
                    color: 'white',
                    border: 'none',
                    fontSize: '20px',
                    transition: 'all 0.3s'
                  }}
                >
                  ←
                </button>

                <div className="d-flex align-items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPage) }).map((_, i) => {
                    let p;
                    if (totalPage <= 5) {
                      p = i + 1;
                    } else if (page <= 3) {
                      p = i + 1;
                    } else if (page >= totalPage - 2) {
                      p = totalPage - 4 + i;
                    } else {
                      p = page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={p}
                        className="btn rounded-circle shadow-sm"
                        onClick={() => setPage(p)}
                        style={{
                          width: '45px',
                          height: '45px',
                          background: p === page ? '#667eea' : 'white',
                          color: p === page ? 'white' : '#667eea',
                          border: p === page ? 'none' : '2px solid #667eea',
                          fontWeight: 'bold',
                          transition: 'all 0.3s'
                        }}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button
                  className="btn btn-lg rounded-circle shadow-sm"
                  onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                  disabled={page === totalPage}
                  style={{
                    width: '50px',
                    height: '50px',
                    background: page === totalPage ? '#e0e0e0' : '#667eea',
                    color: 'white',
                    border: 'none',
                    fontSize: '20px',
                    transition: 'all 0.3s'
                  }}
                >
                  →
                </button>
              </div>
            )}
          </>
        )}

        {geminiLoading && (
          <div 
            className="modal show d-block" 
            style={{ 
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(5px)'
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div 
                className="modal-content border-0 shadow-lg rounded-4 overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%)'
                }}
              >
                <div className="modal-body text-center p-5 position-relative">
               
                  <div 
                    className="position-absolute"
                    style={{
                      top: '-50px',
                      right: '-50px',
                      width: '150px',
                      height: '150px',
                      background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
                      borderRadius: '50%'
                    }}
                  ></div>
                  <div 
                    className="position-absolute"
                    style={{
                      bottom: '-50px',
                      left: '-50px',
                      width: '150px',
                      height: '150px',
                      background: 'radial-gradient(circle, rgba(118, 75, 162, 0.15) 0%, transparent 70%)',
                      borderRadius: '50%'
                    }}
                  ></div>
                  
                  <div className="position-relative">
                   
                    <div className="mb-4">
                      <div 
                        className="d-inline-block"
                        style={{
                          animation: 'bounce 1s ease-in-out infinite'
                        }}
                      >
                        <span style={{ fontSize: '80px' }}>🤖</span>
                      </div>
                    </div>
                    
              
                    <div className="mb-4 position-relative d-inline-block">
                      <div 
                        className="spinner-border" 
                        role="status" 
                        style={{ 
                          width: '4rem', 
                          height: '4rem',
                          color: '#667eea',
                          borderWidth: '4px'
                        }}
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    
                    <h4 className="mb-3 fw-bold" style={{ color: '#667eea' }}>
                      ✨ AI is Creating Your Recipe...
                    </h4>
                    <p className="text-muted mb-4 fs-5">
                      Gemini AI is crafting a delicious recipe just for you!
                    </p>
                    
                 
                    <div className="d-flex justify-content-center gap-3 mt-4">
                      <div 
                        className="px-3 py-2 rounded-pill"
                        style={{
                          background: 'rgba(102, 126, 234, 0.1)',
                          animation: 'pulse 1.5s ease-in-out infinite',
                          animationDelay: '0s'
                        }}
                      >
                        <span className="small fw-semibold" style={{ color: '#667eea' }}>
                          📝 Analyzing...
                        </span>
                      </div>
                      <div 
                        className="px-3 py-2 rounded-pill"
                        style={{
                          background: 'rgba(102, 126, 234, 0.1)',
                          animation: 'pulse 1.5s ease-in-out infinite',
                          animationDelay: '0.5s'
                        }}
                      >
                        <span className="small fw-semibold" style={{ color: '#667eea' }}>
                          🥘 Mixing...
                        </span>
                      </div>
                      <div 
                        className="px-3 py-2 rounded-pill"
                        style={{
                          background: 'rgba(102, 126, 234, 0.1)',
                          animation: 'pulse 1.5s ease-in-out infinite',
                          animationDelay: '1s'
                        }}
                      >
                        <span className="small fw-semibold" style={{ color: '#667eea' }}>
                          ✨ Finalizing...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

   
        {geminiRecipe && (
          <div 
            className="modal show d-block" 
            style={{ 
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(5px)'
            }} 
            onClick={() => setGeminiRecipe(null)}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
              <div 
                className="modal-content border-0 shadow-lg rounded-4 overflow-hidden"
                style={{
                  animation: 'slideInDown 0.3s ease-out'
                }}
              >
              
                <div 
                  className="modal-header border-0 position-relative p-4"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    minHeight: '180px'
                  }}
                >
                 
                  <div 
                    className="position-absolute"
                    style={{
                      top: '-30px',
                      right: '-30px',
                      width: '150px',
                      height: '150px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '50%'
                    }}
                  ></div>
                  <div 
                    className="position-absolute"
                    style={{
                      bottom: '-50px',
                      left: '-20px',
                      width: '100px',
                      height: '100px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '50%'
                    }}
                  ></div>
                  
                  <div className="w-100 position-relative">
                    
                    <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                      <span 
                        className="badge px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2"
                        style={{ 
                          background: 'rgba(255,255,255,0.25)',
                          backdropFilter: 'blur(10px)',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>✨</span>
                        AI Generated
                      </span>
                      <span 
                        className="badge px-3 py-2 rounded-pill"
                        style={{ 
                          background: 'rgba(255,255,255,0.25)',
                          backdropFilter: 'blur(10px)',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        {geminiRecipe.category}
                      </span>
                    </div>
                    
                
                    <h2 className="modal-title text-white fw-bold mb-3" style={{ fontSize: '32px' }}>
                      {geminiRecipe.title}
                    </h2>
                    
              
                    <div className="d-flex align-items-center gap-4 text-white flex-wrap">
                      <span className="d-inline-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
                        <span style={{ fontSize: '20px' }}>🌍</span>
                        <span style={{ opacity: 0.95 }}>{geminiRecipe.area}</span>
                      </span>
                      <span className="d-inline-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
                        <span style={{ fontSize: '20px' }}>⏱️</span>
                        <span style={{ opacity: 0.95 }}>{geminiRecipe.durationMinutes} mins</span>
                      </span>
                      <span className="d-inline-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
                        <span style={{ fontSize: '20px' }}>🤖</span>
                        <span style={{ opacity: 0.95 }}>Powered by Gemini</span>
                      </span>
                    </div>
                  </div>
                  
                 
                  <button 
                    type="button" 
                    className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                    style={{
                      background: 'rgba(255,255,255,0.25)',
                      borderRadius: '50%',
                      padding: '12px',
                      opacity: 1
                    }}
                    onClick={() => setGeminiRecipe(null)}
                  ></button>
                </div>
                
          
                <div 
                  className="modal-body p-4"
                  style={{ 
                    maxHeight: '60vh',
                    overflowY: 'auto',
                    background: 'linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%)'
                  }}
                >
               
                  {geminiRecipe.thumbnail && (
                    <div className="mb-4 text-center position-relative">
                      <div 
                        className="position-relative d-inline-block rounded-4 overflow-hidden shadow-lg"
                        style={{
                          maxHeight: '300px',
                          width: '100%'
                        }}
                      >
                        <img 
                          src={geminiRecipe.thumbnail} 
                          alt={geminiRecipe.title}
                          className="img-fluid w-100"
                          style={{ 
                            maxHeight: '300px',
                            objectFit: 'cover'
                          }}
                        />
                        <div 
                          className="position-absolute top-0 start-0 w-100 h-100"
                          style={{
                            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)'
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

               
                  <div className="mb-4">
                    <div 
                      className="d-inline-flex align-items-center gap-2 mb-3 px-3 py-2 rounded-pill"
                      style={{
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                      }}
                    >
                      <span style={{ fontSize: '24px' }}>🥘</span>
                      <h5 className="fw-bold mb-0" style={{ color: '#667eea' }}>Ingredients</h5>
                    </div>
                    
                    <div className="row g-2">
                      {geminiRecipe.ingredients?.map((ing, idx) => (
                        <div key={idx} className="col-md-6">
                          <div 
                            className="p-3 rounded-3 h-100 d-flex align-items-center gap-2"
                            style={{
                              background: 'white',
                              border: '1px solid rgba(102, 126, 234, 0.1)',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)';
                              e.currentTarget.style.borderColor = '#667eea';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.1)';
                            }}
                          >
                            <span 
                              className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                              style={{
                                width: '28px',
                                height: '28px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: 'bold'
                              }}
                            >
                              ✓
                            </span>
                            <span className="flex-grow-1">{ing}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

              
                  <div className="mb-3">
                    <div 
                      className="d-inline-flex align-items-center gap-2 mb-3 px-3 py-2 rounded-pill"
                      style={{
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                      }}
                    >
                      <span style={{ fontSize: '24px' }}>📝</span>
                      <h5 className="fw-bold mb-0" style={{ color: '#667eea' }}>Instructions</h5>
                    </div>
                    
                    <div 
                      className="card border-0 rounded-4 p-4 shadow-sm"
                      style={{
                        background: 'white'
                      }}
                    >
                      <p className="mb-0" style={{ whiteSpace: 'pre-line', lineHeight: '2', fontSize: '15px' }}>
                        {geminiRecipe.instructions}
                      </p>
                    </div>
                  </div>

               
                  <div 
                    className="alert border-0 mt-4 mb-0 rounded-4 d-flex align-items-start gap-3 p-4"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                      border: '2px solid rgba(102, 126, 234, 0.2)'
                    }}
                  >
                    <span 
                      className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: '20px'
                      }}
                    >
                      💡
                    </span>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-2" style={{ color: '#667eea' }}>AI-Generated Recipe Notice</h6>
                      <small className="text-muted" style={{ lineHeight: '1.6' }}>
                        This recipe was generated by Gemini AI. Please review ingredients and instructions carefully before cooking. 
                        Adjust seasoning and cooking times to your taste and equipment!
                      </small>
                    </div>
                  </div>
                </div>

          
                <div 
                  className="modal-footer border-0 p-4 pt-3"
                  style={{
                    background: 'linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)'
                  }}
                >
                  <button 
                    type="button" 
                    className="btn btn-lg px-5 py-3 rounded-pill text-white fw-semibold shadow-lg"
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => setGeminiRecipe(null)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <span className="me-2">👍</span>
                    Got it, thanks!
                    <span className="ms-2">✨</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

