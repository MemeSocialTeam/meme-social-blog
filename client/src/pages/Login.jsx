import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";
import "../styles/login.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAlert } from "../context/AlertContext";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
    const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  return (
    <div className="login-container">
      {/* {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          fixed
        />
      )} */}
      <div className="login-box">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="password-wrapper">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </div>
          </div>

          <button type="submit">Sign In</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
