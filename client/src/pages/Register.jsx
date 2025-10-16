import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });

  function onChange(e) { 
    setForm({ ...form, [e.target.name]: e.target.value }); 
  }
  
  async function onSubmit(e) { 
    e.preventDefault(); 
    try {
      await axios.post("http://localhost:4000/apis/auth/register", form);
      
     
      const roleMessage = form.role === 'chef' ? 
        "<p>👨‍🍳 Your chef account is ready!</p><p>You can now write and share recipes.</p>" :
        "<p>🍽️ Your account is ready!</p><p>You can now browse and enjoy recipes.</p>";
        
      Swal.fire({
        title: "Success! 🎉",
        html: roleMessage,
        icon: "success",
        confirmButtonColor: "#667eea",
        confirmButtonText: "Go to Login 🚀"
      }).then(() => {
    
        window.location.href = "/login";
      });
      
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.error || error.message || "Something went wrong!",
        icon: "error"
      });
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative"
         style={{ 
           backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/picture/451c3a2537616f5d5d06750972b5458e.jpg')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
         
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle shadow-lg"
                   style={{ 
                     width: '120px', 
                     height: '120px', 
                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                     border: '5px solid rgba(255,255,255,0.3)'
                   }}>
                <span style={{ fontSize: '60px' }}>🍽️</span>
              </div>
            </div>

            <div className="card shadow-lg border-0 rounded-4 overflow-hidden"
                 style={{
                   background: 'rgba(255, 255, 255, 0.95)',
                   backdropFilter: 'blur(10px)'
                 }}>
          
              <div className="text-center pt-4 pb-3 px-4">
                <h2 className="mb-2 fw-bold" style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Join Recipely</h2>
                <p className="text-muted mb-0">
                  <span style={{ fontSize: '18px' }}>👨‍🍳</span> Start your culinary journey today
                </p>
              </div>

              <div className="card-body p-4 p-md-5 pt-3">
              <form onSubmit={onSubmit}>
              
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-semibold text-muted">
                    <span style={{ fontSize: '18px' }}>👤</span> Full Name
                  </label>
                  <input 
                    name="name" 
                    type="text" 
                    id="name"
                    className="form-control form-control-lg rounded-3 border-2" 
                    value={form.name} 
                    onChange={onChange} 
                    placeholder="Your name"
                    required 
                    style={{
                        borderColor: '#e0e0e0',
                        transition: 'all 0.3s'
                    }}
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
                  <label htmlFor="email" className="form-label fw-semibold text-muted">
                    <span style={{ fontSize: '18px' }}>📧</span> Email Address
                  </label>
                  <input 
                    name="email" 
                    type="email" 
                    id="email"
                    className="form-control form-control-lg rounded-3 border-2" 
                    value={form.email} 
                    onChange={onChange} 
                    placeholder="chef@recipely.com"
                    required 
                    style={{
                        borderColor: '#e0e0e0',
                        transition: 'all 0.3s'
                    }}
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
                  <label htmlFor="password" className="form-label fw-semibold text-muted">
                    <span style={{ fontSize: '18px' }}>🔑</span> Password
                  </label>
                  <input 
                    name="password" 
                    type="password" 
                    id="password"
                    className="form-control form-control-lg rounded-3 border-2" 
                    value={form.password} 
                    onChange={onChange} 
                    placeholder="Create your secret recipe (min. 6 chars)"
                    required 
                    minLength={6} 
                    style={{
                        borderColor: '#e0e0e0',
                        transition: 'all 0.3s'
                    }}
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
                    <span style={{ fontSize: '14px' }}>🔐</span> Min. 6 characters for security
                  </small>
                </div>

               
                <div className="mb-4">
                  <label className="form-label fw-semibold text-muted">
                    <span style={{ fontSize: '18px' }}>👥</span> I want to register as:
                  </label>
                  <div className="row g-3">
                    <div className="col-6">
                      <input 
                        type="radio" 
                        className="btn-check" 
                        name="role" 
                        id="role-user" 
                        value="user"
                        checked={form.role === "user"}
                        onChange={onChange}
                      />
                      <label 
                        className="btn btn-outline-primary w-100 py-3 rounded-3" 
                        htmlFor="role-user"
                        style={{
                          border: '2px solid',
                          transition: 'all 0.3s'
                        }}
                      >
                        <div className="mb-2" style={{ fontSize: '32px' }}>🍽️</div>
                        <div className="fw-semibold">Food Lover</div>
                        <small className="text-muted d-block">Browse recipes</small>
                      </label>
                    </div>
                    <div className="col-6">
                      <input 
                        type="radio" 
                        className="btn-check" 
                        name="role" 
                        id="role-chef" 
                        value="chef"
                        checked={form.role === "chef"}
                        onChange={onChange}
                      />
                      <label 
                        className="btn btn-outline-success w-100 py-3 rounded-3" 
                        htmlFor="role-chef"
                        style={{
                          border: '2px solid',
                          transition: 'all 0.3s'
                        }}
                      >
                        <div className="mb-2" style={{ fontSize: '32px' }}>👨‍🍳</div>
                        <div className="fw-semibold">Chef</div>
                        <small className="text-muted d-block">Write & share recipes</small>
                      </label>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="btn btn-lg w-100 rounded-pill fw-semibold text-white shadow-sm"
                  style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      transition: 'all 0.3s',
                      letterSpacing: '0.5px'
                  }}
                  onMouseOver={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseOut={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  }}
                >
                  <span style={{ fontSize: '18px' }}>🍳</span> Create My Kitchen
                </button>
              </form>

              <div className="text-center mt-4">
                <hr className="my-3" style={{ borderColor: '#e0e0e0' }} />
                <p className="text-muted mb-0">
                  <span style={{ fontSize: '16px' }}>👨‍🍳</span> Already a chef? 
                  <a 
                    href="/login" 
                    className="text-decoration-none fw-semibold ms-1"
                    style={{ color: '#667eea' }}
                  >
                    Login to Kitchen
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-white small">
              <span style={{ fontSize: '16px' }}>🎉</span> Join thousands of home chefs worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
