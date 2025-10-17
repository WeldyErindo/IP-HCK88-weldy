import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {jwtDecode} from "jwt-decode";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const checkLoginStatus = () => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    

    window.addEventListener("storage", checkLoginStatus);
    
  
    window.addEventListener("loginStatusChanged", checkLoginStatus);
    
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStatusChanged", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
       
        localStorage.removeItem("access_token");
        setIsLoggedIn(false);
        
       
        window.dispatchEvent(new Event("loginStatusChanged"));
        
     
        Swal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
        
   
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    });
  };

  const handleWriteRecipe = () => {
    const token = localStorage.getItem("access_token");
    
    if (!token) {
     
      Swal.fire({
        title: "Login Required",
        html: "<p>👨‍🍳 You need to be a Chef to write recipes!</p><p>Register as a Chef to start sharing your recipes.</p>",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#23C55E",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Login",
        cancelButtonText: "Register as Chef",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          navigate("/register");
        }
      });
    } else if (userRole !== 'chef') {
     
      Swal.fire({
        title: "Chef Access Only",
        html: "<p>👨‍🍳 Only Chef accounts can write recipes!</p><p>Register a new account as Chef to share your recipes.</p>",
        icon: "info",
        confirmButtonColor: "#23C55E",
        confirmButtonText: "OK"
      });
    } else {
   
      navigate("/add-recipe");
    }
  };

  return (
    <nav 
      className="navbar navbar-expand-md shadow-sm position-relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderBottom: '2px solid rgba(102, 126, 234, 0.5)'
      }}
    >
 
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("/picture/80815088a9ead2ca5491f55f8620712f.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.15,
        filter: 'grayscale(30%)',
        zIndex: 0
      }} />
      
   
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='20' cy='20' r='8'/%3E%3Ccircle cx='60' cy='20' r='6'/%3E%3Ccircle cx='40' cy='40' r='10'/%3E%3Ccircle cx='20' cy='60' r='6'/%3E%3Ccircle cx='60' cy='60' r='8'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        zIndex: 1
      }} />

    
      <div style={{
        position: 'absolute',
        left: '8%',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '36px',
        opacity: 0.15,
        zIndex: 2,
        pointerEvents: 'none',
        animation: 'float 3s ease-in-out infinite',
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
      }} className="d-none d-lg-block">
        🧅
      </div>
      
      <div style={{
        position: 'absolute',
        left: '18%',
        top: '30%',
        fontSize: '28px',
        opacity: 0.15,
        zIndex: 2,
        pointerEvents: 'none',
        animation: 'float 2.5s ease-in-out infinite 0.5s',
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
      }} className="d-none d-lg-block">
        🍅
      </div>
      
      <div style={{
        position: 'absolute',
        right: '18%',
        top: '70%',
        fontSize: '32px',
        opacity: 0.15,
        zIndex: 2,
        pointerEvents: 'none',
        animation: 'float 2.8s ease-in-out infinite 1s',
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
      }} className="d-none d-lg-block">
        🥕
      </div>
      
      <div style={{
        position: 'absolute',
        right: '8%',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '34px',
        opacity: 0.15,
        zIndex: 2,
        pointerEvents: 'none',
        animation: 'float 3.2s ease-in-out infinite 1.5s',
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
      }} className="d-none d-lg-block">
        🌶️
      </div>
      
      <div style={{
        position: 'absolute',
        left: '28%',
        top: '50%',
        fontSize: '24px',
        opacity: 0.15,
        zIndex: 2,
        pointerEvents: 'none',
        animation: 'float 2.7s ease-in-out infinite 0.8s',
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
      }} className="d-none d-xxl-block">
        🧄
      </div>
      
      <div style={{
        position: 'absolute',
        right: '28%',
        top: '50%',
        fontSize: '26px',
        opacity: 0.15,
        zIndex: 2,
        pointerEvents: 'none',
        animation: 'float 2.9s ease-in-out infinite 1.2s',
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
      }} className="d-none d-xxl-block">
        🫑
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
        <button 
          className="navbar-brand fw-bold btn btn-link p-0 text-white text-decoration-none" 
          onClick={() => navigate("/")}
          style={{
            fontSize: '24px',
            transition: 'all 0.3s',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.textShadow = '0 4px 8px rgba(0,0,0,0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.textShadow = '0 2px 4px rgba(0,0,0,0.2)';
          }}
        >
          🍳 Recipely
        </button>

        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navRecipely"
          style={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <span className="navbar-toggler-icon" style={{ filter: 'brightness(0) invert(1)' }}></span>
        </button>

        <div className="collapse navbar-collapse" id="navRecipely">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link text-white fw-500" 
                onClick={() => navigate("/")}
                style={{
                  transition: 'all 0.3s',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.textShadow = '0 4px 8px rgba(0,0,0,0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.textShadow = '0 2px 4px rgba(0,0,0,0.2)';
                }}
              >
                🏠 Home
              </button>
            </li>
            {isLoggedIn && userRole === 'chef' && (
              <>
                <li className="nav-item">
                  <button 
                    className="nav-link btn btn-link text-white fw-semibold" 
                    onClick={handleWriteRecipe}
                    style={{
                      transition: 'all 0.3s',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.textShadow = '0 4px 8px rgba(0,0,0,0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.textShadow = '0 2px 4px rgba(0,0,0,0.2)';
                    }}
                  >
                    ✏️ Write Recipe
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className="nav-link btn btn-link text-white fw-500" 
                    onClick={() => navigate("/my-recipes")}
                    style={{
                      transition: 'all 0.3s',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.textShadow = '0 4px 8px rgba(0,0,0,0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.textShadow = '0 2px 4px rgba(0,0,0,0.2)';
                    }}
                  >
                    📚 My Recipes
                  </button>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex gap-2 align-items-center">
            {isLoggedIn ? (
              <>
                <span className="text-white small d-none d-md-inline" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  👋 Welcome back!
                </span>
                <button 
                  className="btn rounded-pill px-4"
                  onClick={handleLogout}
                  style={{
                    background: 'rgba(220, 53, 69, 0.9)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.3)',
                    transition: 'all 0.3s',
                    fontWeight: '500'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.background = 'rgba(220, 53, 69, 1)';
                    e.target.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.background = 'rgba(220, 53, 69, 0.9)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn rounded-pill px-4"
                  onClick={() => navigate("/register")}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.4)',
                    transition: 'all 0.3s',
                    fontWeight: '500'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.background = 'rgba(255,255,255,0.3)';
                    e.target.style.boxShadow = '0 4px 12px rgba(255,255,255,0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  ✨ Register
                </button>
                <button 
                  className="btn rounded-pill px-4"
                  onClick={() => navigate("/login")}
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    color: '#667eea',
                    border: '2px solid rgba(255,255,255,0.6)',
                    transition: 'all 0.3s',
                    fontWeight: '600'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.background = 'rgba(255,255,255,1)';
                    e.target.style.boxShadow = '0 4px 12px rgba(255,255,255,0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.background = 'rgba(255,255,255,0.95)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  🔐 Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

