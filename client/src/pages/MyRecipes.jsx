import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

export default function MyRecipes() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to view your recipes",
        icon: "warning",
        confirmButtonColor: "#23C55E"
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    fetchMyRecipes();
  }, [navigate]);

  const fetchMyRecipes = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const { data } = await axios.get("http://localhost:4000/apis/recipes/my", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setRecipes(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete Recipe?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("access_token");
          await axios.delete(`http://localhost:4000/apis/recipes/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          Swal.fire({
            title: "Deleted!",
            text: "Your recipe has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });

          fetchMyRecipes();
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: error.response?.data?.error || "Failed to delete recipe",
            icon: "error"
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">Loading your recipes...</p>
      </div>
    );
  }

  return (
    <div 
      className="container py-5"
      style={{
        minHeight: '100vh',
        position: 'relative'
      }}
    >
  
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        opacity: 0.03,
        zIndex: -2,
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'fixed',
        top: '10%',
        left: '5%',
        width: '120px',
        height: '120px',
        backgroundImage: 'url("/picture/34b60254cf137fe1bbfe0a5b10b4ae9e.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '50%',
        opacity: 0.08,
        filter: 'blur(2px)',
        zIndex: -1,
        pointerEvents: 'none',
        animation: 'float 6s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'fixed',
        top: '60%',
        right: '8%',
        width: '150px',
        height: '150px',
        backgroundImage: 'url("/picture/38aac559084c6cea0019c76d5e1ac76e.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '50%',
        opacity: 0.08,
        filter: 'blur(2px)',
        zIndex: -1,
        pointerEvents: 'none',
        animation: 'float 7s ease-in-out infinite 1s'
      }} />

  
      <div className="text-center mb-4">
        <span 
          className="badge px-4 py-2"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontSize: '16px',
            border: 'none'
          }}
        >
          📚 My Recipe Collection
        </span>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="fw-bold mb-0">
              <span style={{ fontSize: '30px' }}>👨‍🍳</span> My Recipes
            </h2>
            <button
              className="btn rounded-pill px-4"
              onClick={() => navigate("/add-recipe")}
              style={{
                background: '#23C55E',
                color: 'white',
                fontWeight: '500',
                border: 'none'
              }}
            >
              ➕ Add New Recipe
            </button>
          </div>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div 
          className="card border-0 rounded-4 p-5 text-center position-relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}
        >
      
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("/picture/471ace52be35f217e71c97515c78d5f0.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.05,
            zIndex: 0
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="mb-3">
              <span style={{ fontSize: '80px' }}>📝</span>
            </div>
            <h4 className="mb-3 fw-bold">No Recipes Yet</h4>
            <p className="text-muted mb-4">Start sharing your culinary creations with the world!</p>
            <button
              className="btn btn-lg rounded-pill px-5 mx-auto"
              onClick={() => navigate("/add-recipe")}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: '600',
                border: 'none',
                maxWidth: '300px',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              ✏️ Write Your First Recipe
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {recipes.map((recipe, index) => {
           
            const bgImages = [
              '/picture/2f577c22a5ff5900db55d4a2227eb35d.jpg',
              '/picture/34b60254cf137fe1bbfe0a5b10b4ae9e.jpg',
              '/picture/38aac559084c6cea0019c76d5e1ac76e.jpg',
              '/picture/451c5992c10ec55a6e2f7f809f01804e.jpg',
              '/picture/471ace52be35f217e71c97515c78d5f0.jpg',
              '/picture/806c4c4e3faa359f4da6e02adc0f2e9f.jpg',
              '/picture/80815088a9ead2ca5491f55f8620712f.jpg',
              '/picture/c65cb6833cc9d51d16e3bfa93df42301.jpg'
            ];
            const bgImage = bgImages[index % bgImages.length];
            
            return (
              <div key={recipe.id} className="col-12 col-md-6 col-lg-4">
                <div 
                  className="card h-100 border-0 rounded-4 overflow-hidden position-relative"
                  style={{
                    background: 'white',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                  }}
                >
              
                  <div 
                    style={{
                      height: '200px',
                      backgroundImage: `url(${recipe.thumbnail || bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}
                  >
                   
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 100%)'
                    }} />
                    
                   
                    {recipe.Category && (
                      <div 
                        className="position-absolute top-0 start-0 m-3"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}
                      >
                        {recipe.Category.name}
                      </div>
                    )}
                    
                  
                    <div 
                      className="position-absolute top-0 end-0 m-3"
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        color: '#333',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}
                    >
                      #{index + 1}
                    </div>
                  </div>
                  
              
                  <div className="card-body p-4">
                    <h5 className="card-title fw-bold mb-3" style={{ color: '#333', fontSize: '18px' }}>
                      {recipe.title}
                    </h5>
                    
                
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {recipe.durationMinutes && (
                        <span 
                          className="badge"
                          style={{
                            background: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea',
                            padding: '6px 12px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}
                        >
                          ⏱️ {recipe.durationMinutes} min
                        </span>
                      )}
                      <span 
                        className="badge"
                        style={{
                          background: 'rgba(108, 117, 125, 0.1)',
                          color: '#6c757d',
                          padding: '6px 12px',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        📅 {new Date(recipe.createdAt).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                  
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm rounded-pill flex-grow-1"
                        onClick={() => navigate(`/meal/${recipe.id}`)}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          fontWeight: '500',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        👁️ View
                      </button>
                      <button
                        className="btn btn-sm rounded-pill"
                        onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
                        style={{
                          background: 'rgba(35, 197, 94, 0.1)',
                          color: '#23C55E',
                          border: 'none',
                          fontWeight: '500',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#23C55E';
                          e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'rgba(35, 197, 94, 0.1)';
                          e.target.style.color = '#23C55E';
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-sm rounded-pill"
                        onClick={() => handleDelete(recipe.id)}
                        style={{
                          background: 'rgba(220, 53, 69, 0.1)',
                          color: '#dc3545',
                          border: 'none',
                          fontWeight: '500',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#dc3545';
                          e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'rgba(220, 53, 69, 0.1)';
                          e.target.style.color = '#dc3545';
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
    
      {recipes.length > 0 && (
        <div 
          className="card border-0 rounded-4 mt-4 p-4 text-center"
          style={{
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ color: '#667eea', fontWeight: '600', fontSize: '18px' }}>
            <span style={{ fontSize: '24px' }}>📊</span> Total: <strong>{recipes.length}</strong> recipe{recipes.length !== 1 ? 's' : ''} in your collection
          </div>
        </div>
      )}
    </div>
  );
}
