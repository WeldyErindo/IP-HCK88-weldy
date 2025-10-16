import { useState, useEffect } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { useNavigate } from "react-router"

export default function Login() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm({...form, [name]:value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post(`http://localhost:4000/apis/auth/login`, form)
   
            localStorage.setItem("access_token", data.access_token)
            
            window.dispatchEvent(new Event("loginStatusChanged"))
            
       
            Swal.fire({
                title: "Success",
                text: "Login successful!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            })  
          
            setTimeout(() => {
                navigate("/")
            }, 1500)
            
        } catch (error) {
            console.log(error)
            Swal.fire({
                title: "Error",
                text: error.response?.data?.error || error.message || "Something went wrong!",
                icon: "error"
            })
        }
    }

    async function handleCredentialResponse(response) {
        console.log("Google response received:", response); 
        
        try {
            if (!response.credential) {
                throw new Error("No credential received from Google");
            }
            
       
            const { data } = await axios.post("http://localhost:4000/apis/auth/google", {
                googleToken: response.credential
            });
            
            console.log("Backend response:", data);
       
            localStorage.setItem("access_token", data.access_token);
            
   
            window.dispatchEvent(new Event("loginStatusChanged"));
            
     
            Swal.fire({
                title: "Success",
                text: "Google login successful!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
        
            setTimeout(() => {
                navigate("/");
            }, 1500);
            
        } catch (error) {
            console.error("Google login error:", error); 
            Swal.fire({
                title: "Error",
                text: error.response?.data?.error || error.message || "Google login failed!",
                icon: "error"
            });
        }
    }

    useEffect(() => {
        const initializeGoogle = () => {
           
            if (window.google && window.google.accounts) {
                try {
                    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
                    console.log("Initializing Google with Client ID:", clientId); 
                    
                    window.google.accounts.id.initialize({
                        client_id: clientId,
                        callback: handleCredentialResponse
                    });
                    
                    window.google.accounts.id.renderButton(
                        document.getElementById("buttonDiv"),
                        { 
                            theme: "outline", 
                            size: "large",
                            width: "100%",
                            text: "signin_with",
                            shape: "pill"
                        }
                    );
                    
                    console.log("Google Sign-In initialized successfully"); 
                } catch (error) {
                    console.error("Error initializing Google Sign-In:", error);
                }
            } else {
             
                console.log("Google script not loaded yet, retrying...");
                setTimeout(initializeGoogle, 100);
            }
        };
        
        initializeGoogle();
    }, [])
    
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative"
             style={{ 
               backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/picture/2f577c22a5ff5900db55d4a2227eb35d.jpg')",
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
                              <span style={{ fontSize: '60px' }}>🍳</span>
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
                                }}>Welcome Back, Chef!</h2>
                                <p className="text-muted mb-0">
                                    <span style={{ fontSize: '18px' }}>🍳</span> Login to discover delicious recipes
                                </p>
                            </div>

                            <div className="card-body p-4 p-md-5 pt-3">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="form-label fw-semibold text-muted">
                                        <span style={{ fontSize: '18px' }}>📧</span> Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        value={form.email} 
                                        onChange={handleChange}
                                        className="form-control form-control-lg rounded-3 border-2"
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
                                        type="password" 
                                        id="password" 
                                        name="password" 
                                        value={form.password} 
                                        onChange={handleChange}
                                        className="form-control form-control-lg rounded-3 border-2"
                                        placeholder="Enter your secret recipe"
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
                                    <span style={{ fontSize: '18px' }}>🚀</span> Start Cooking
                                </button>
                            </form>

                            <div className="text-center my-4">
                                <div className="position-relative">
                                    <hr className="my-3" style={{ borderColor: '#e0e0e0' }} />
                                    <span 
                                        className="position-absolute top-50 start-50 translate-middle bg-white px-3"
                                        style={{ fontSize: '14px', color: '#999' }}
                                    >
                                        <span style={{ fontSize: '16px' }}>🍴</span> OR <span style={{ fontSize: '16px' }}>🍴</span>
                                    </span>
                                </div>
                            </div>

                     
                            <div id="buttonDiv" className="d-flex justify-content-center mb-3"></div>

                            <div className="text-center mt-4">
                                <p className="text-muted mb-0">
                                    <span style={{ fontSize: '16px' }}>👨‍🍳</span> New to Recipely? 
                                    <a 
                                        href="/register" 
                                        className="text-decoration-none fw-semibold ms-1"
                                        style={{ color: '#667eea' }}
                                    >
                                        Join the Kitchen
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

              
                    <div className="text-center mt-4">
                        <p className="text-white small">
                            <span style={{ fontSize: '16px' }}>🔒</span> Your recipes are safe with us
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}