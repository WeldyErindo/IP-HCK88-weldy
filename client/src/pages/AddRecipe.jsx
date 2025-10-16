import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

const COUNTRIES = [
  "American", "British", "Canadian", "Chinese", "Croatian", "Dutch", "Egyptian", 
  "Filipino", "French", "Greek", "Indian", "Irish", "Italian", "Jamaican", 
  "Japanese", "Kenyan", "Malaysian", "Mexican", "Moroccan", "Polish", "Portuguese", 
  "Russian", "Spanish", "Thai", "Tunisian", "Turkish", "Ukrainian", "Vietnamese",
  "Indonesian", "Korean", "Brazilian", "Argentinian", "German", "Australian",
  "Lebanese", "Peruvian", "Swedish", "Norwegian", "Danish", "Belgian", "Swiss",
  "Austrian", "Hungarian", "Czech", "Romanian", "Bulgarian", "Serbian", "Finnish",
  "Icelandic", "Chilean", "Colombian", "Venezuelan", "Cuban", "Puerto Rican",
  "Pakistani", "Bangladeshi", "Sri Lankan", "Nepalese", "Burmese", "Cambodian",
  "Laotian", "Singaporean", "Taiwanese", "Hong Kong", "Ethiopian", "Nigerian",
  "South African", "Ghanaian", "Algerian", "Libyan", "Sudanese", "Saudi Arabian",
  "Emirati", "Qatari", "Kuwaiti", "Iranian", "Iraqi", "Syrian", "Jordanian",
  "Israeli", "Palestinian", "Afghan", "Uzbek", "Kazakh", "Mongolian"
];

export default function AddRecipe() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    thumbnail: "",
    area: "",
    ingredients: "",
    instructions: "",
    durationMinutes: "",
    sourceUrl: "",
    CategoryId: ""
  });

  useEffect(() => {
   
    const token = localStorage.getItem("access_token");
    if (!token) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to write recipes",
        icon: "warning",
        confirmButtonColor: "#667eea"
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    fetchCategories();
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/apis/categories");
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("access_token");
      
    
      const ingredientsArray = form.ingredients
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          line = line.trim();
     
          if (line.includes(' - ')) {
            const [ingredient, measure] = line.split(' - ').map(s => s.trim());
            return { ingredient, measure };
          } else {
           
            const parts = line.match(/^([\d\/\s]+\w+)\s+(.+)$/);
            if (parts) {
              return { ingredient: parts[2], measure: parts[1].trim() };
            }
        
            return { ingredient: line, measure: '' };
          }
        });

      const payload = {
        ...form,
        ingredients: ingredientsArray,
        durationMinutes: form.durationMinutes ? parseInt(form.durationMinutes) : null,
        CategoryId: form.CategoryId ? parseInt(form.CategoryId) : null
      };

      await axios.post(
        "http://localhost:4000/apis/recipes",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      Swal.fire({
        title: "Success!",
        html: "<p>🎉 Your recipe has been published!</p>",
        icon: "success",
        confirmButtonColor: "#667eea",
        timer: 2000,
        showConfirmButton: false
      });

   
      window.dispatchEvent(new Event("recipeAdded"));

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.error || "Failed to create recipe",
        icon: "error"
      });
    }
  };

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
        top: '15%',
        right: '10%',
        width: '100px',
        height: '100px',
        backgroundImage: 'url("/picture/806c4c4e3faa359f4da6e02adc0f2e9f.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '50%',
        opacity: 0.08,
        filter: 'blur(2px)',
        zIndex: -1,
        pointerEvents: 'none',
        animation: 'float 7s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'fixed',
        bottom: '10%',
        left: '8%',
        width: '130px',
        height: '130px',
        backgroundImage: 'url("/picture/c65cb6833cc9d51d16e3bfa93df42301.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '50%',
        opacity: 0.08,
        filter: 'blur(2px)',
        zIndex: -1,
        pointerEvents: 'none',
        animation: 'float 6s ease-in-out infinite 1.5s'
      }} />
      
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
      
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
              ✏️ Share Your Recipe
            </span>
          </div>

          <div 
            className="card border-0 rounded-4 overflow-hidden position-relative"
            style={{
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
           
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '300px',
              backgroundImage: 'url("/picture/451c5992c10ec55a6e2f7f809f01804e.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.05,
              zIndex: 0
            }} />
            
     
            <div className="card-header text-center py-5 border-0 position-relative" style={{ background: 'transparent' }}>
              <div className="mb-3">
                <div 
                  className="rounded-circle bg-white d-inline-flex align-items-center justify-content-center shadow-sm"
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    border: '4px solid transparent',
                    backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box'
                  }}
                >
                  <span style={{ fontSize: '50px' }}>📝</span>
                </div>
              </div>
              <h2 className="mb-2 fw-bold" style={{ color: '#333' }}>Write Your Recipe</h2>
              <p className="text-muted mb-0">
                <span style={{ fontSize: '18px' }}>🍳</span> Share your culinary masterpiece with the world
              </p>
            </div>

        
            <div className="card-body p-4 p-md-5 position-relative" style={{ zIndex: 1 }}>
              <form onSubmit={handleSubmit}>
           
                <div className="mb-4">
                  <label htmlFor="title" className="form-label fw-semibold text-muted">
                    <span style={{ fontSize: '18px' }}>🍽️</span> Recipe Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="form-control form-control-lg rounded-3 border-2"
                    placeholder="e.g., Grandma's Apple Pie"
                    value={form.title}
                    onChange={handleChange}
                    required
                    style={{ borderColor: '#e0e0e0' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

      
                <div className="mb-4">
                  <label htmlFor="CategoryId" className="form-label fw-semibold text-muted">
                    <span style={{ fontSize: '18px' }}>🏷️</span> Category
                  </label>
                  <select
                    id="CategoryId"
                    name="CategoryId"
                    className="form-select form-select-lg rounded-3 border-2"
                    value={form.CategoryId}
                    onChange={handleChange}
                    style={{ borderColor: '#e0e0e0' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Select a category (optional)...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

           
                <div className="mb-4">
                  <label htmlFor="area" className="form-label fw-semibold text-muted">
                    <span style={{ fontSize: '18px' }}>🌍</span> Country/Cuisine
                  </label>
                  <select
                    id="area"
                    name="area"
                    className="form-select form-select-lg rounded-3 border-2"
                    value={form.area}
                    onChange={handleChange}
                    style={{ borderColor: '#e0e0e0' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Select a country/cuisine (optional)...</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  <small className="text-muted">
                    <span style={{ fontSize: '14px' }}>💡</span> Tip: Specify the cuisine origin or country
                  </small>
                </div>

                <div className="mb-4">
                  <label htmlFor="thumbnail" className="form-label fw-semibold text-muted">
                    <span style={{ fontSize: '18px' }}>🖼️</span> Image URL
                  </label>
                  <input
                    type="url"
                    id="thumbnail"
                    name="thumbnail"
                    className="form-control form-control-lg rounded-3 border-2"
                    placeholder="https://example.com/image.jpg"
                    value={form.thumbnail}
                    onChange={handleChange}
                    style={{ borderColor: '#e0e0e0' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <small className="text-muted">
                    <span style={{ fontSize: '14px' }}>💡</span> Tip: Use a direct link to your recipe image
                  </small>
                </div>

           
                <div className="mb-4">
                  <label htmlFor="ingredients" className="form-label fw-semibold text-muted">
                    <span style={{ fontSize: '18px' }}>🥗</span> Ingredients
                  </label>
                  <textarea
                    id="ingredients"
                    name="ingredients"
                    className="form-control rounded-3 border-2"
                    placeholder="List your ingredients (one per line)&#10;Format: 'measure ingredient' or 'ingredient - measure'&#10;Examples:&#10;2 cups flour&#10;sugar - 1 cup&#10;3 eggs&#10;salt - 1 tsp"
                    value={form.ingredients}
                    onChange={handleChange}
                    required
                    rows="8"
                    style={{ borderColor: '#e0e0e0' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <small className="text-muted">
                    <span style={{ fontSize: '14px' }}>💡</span> Tip: Write ingredients with measurements for better clarity
                  </small>
                </div>

         
                <div className="mb-4">
                  <label htmlFor="instructions" className="form-label fw-semibold text-muted">
                    <span style={{ fontSize: '18px' }}>📋</span> Instructions
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    className="form-control rounded-3 border-2"
                    placeholder="Write step-by-step instructions..."
                    value={form.instructions}
                    onChange={handleChange}
                    required
                    rows="8"
                    style={{ borderColor: '#e0e0e0' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

            
                <div className="mb-4">
                  <label htmlFor="durationMinutes" className="form-label fw-semibold text-muted">
                    <span style={{ fontSize: '18px' }}>⏱️</span> Cooking Time (minutes)
                  </label>
                  <input
                    type="number"
                    id="durationMinutes"
                    name="durationMinutes"
                    className="form-control form-control-lg rounded-3 border-2"
                    placeholder="e.g., 30"
                    value={form.durationMinutes}
                    onChange={handleChange}
                    min="1"
                    style={{ borderColor: '#e0e0e0' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

            
                <div className="mb-4">
                  <label htmlFor="sourceUrl" className="form-label fw-semibold text-muted">
                    <span style={{ fontSize: '18px' }}>🔗</span> Source URL (optional)
                  </label>
                  <input
                    type="url"
                    id="sourceUrl"
                    name="sourceUrl"
                    className="form-control form-control-lg rounded-3 border-2"
                    placeholder="https://youtube.com/watch?v=... or recipe link"
                    value={form.sourceUrl}
                    onChange={handleChange}
                    style={{ borderColor: '#e0e0e0' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <small className="text-muted">
                    <span style={{ fontSize: '14px' }}>💡</span> Tip: Add YouTube link for video tutorial or original source
                  </small>
                </div>

           
                <div className="d-flex gap-3">
                  <button
                    type="button"
                    className="btn btn-lg rounded-pill px-4"
                    onClick={() => navigate("/")}
                    style={{
                      background: '#f0f0f0',
                      color: '#666',
                      border: 'none',
                      fontWeight: '500'
                    }}
                  >
                    ❌ Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-lg flex-grow-1 rounded-pill fw-semibold text-white shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      transition: 'all 0.3s',
                      letterSpacing: '0.5px'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>🚀</span> Publish Recipe
                  </button>
                </div>
              </form>
            </div>
          </div>

      
          <div className="text-center mt-4">
            <p className="text-muted small">
              <span style={{ fontSize: '16px' }}>✨</span> Share your passion for cooking with the community
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
