import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../css/Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await api.post("token/", {
        username,
        password,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      navigate("/dashboard");
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">
          <div className="login-logo">
            TB
          </div>

          <h1>Task Board</h1>

          <p>
            Sign in to manage your tasks
          </p>
        </div>


        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <div className="login-form-group">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />
          </div>


          <div className="login-form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>


          {error && (
            <div className="login-error">
              {error}
            </div>
          )}


          <button
            className="login-button"
            type="submit"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;