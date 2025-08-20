import React,{ useState } from "react";
import "../styles/Login.css"; 
import { Link,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
    const notifySuccess = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();
    const handleLogin = async (e) => {
      e.preventDefault();
  
      if (!email || !password) {
          notifyError("All fields are required!");
          return;
      }
  
      setLoading(true);
      try {
          const response = await fetch("http://localhost:5000/api/login", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
          });
  
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Email ou mot de passe incorrect");
          }
  
          const data = await response.json();  // ✅ Convertir la réponse en JSON
          const { role, token } = data;        // ✅ Extraire les données correctement
  
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
  
          if (role === "admin") {
              navigate("/admin/dashboard");
              notifySuccess("Admin connecté avec succès!");
          } else if (role === "manager") {
              navigate("/manager/dashboard");
              notifySuccess("Manager connecté avec succès!");
          } else if (role === "commercial") {
              navigate("/commercial/dashboard");
              notifySuccess("Commercial connecté avec succès!");
          }
      } catch (error) {
          notifyError("Échec de connexion. Vérifiez vos informations.");
          setErrorMessage(error.message);
      } finally {
          setLoading(false);
      }
  };
  


  return (
    <div className="login-container">
      {/* Image Section */}
      <div className="image-section">
        <img
          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
          className="img-fluid"
          alt=""
        />
      </div>

      {/* Login Form Section */}
      <div className="login-form-section">
        <div className="form-container">
        <h1>Bienvenue</h1>
          <h3>Connectez-vous a votre espace Personnel</h3>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="email">Address Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div>
              <label htmlFor="password">Mot de Passe</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="checkbox-container">
              <div className="remember-me">
                <input id="remember-me" name="remember-me" type="checkbox" />
                <label htmlFor="remember-me">Se Souvenir de moi</label>
              </div>
              <Link to="/" className="forgot-password">Mot de Passe Oublié?</Link>
            </div>
            <div>
              <button type="submit" 
              className="submit-btn"> 
               {loading ? "Connexion..." : "Se connecter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;