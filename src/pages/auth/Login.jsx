import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      // AUTH STORAGE
      localStorage.setItem("cms-token", data.token);
      localStorage.setItem("admin-user", JSON.stringify(data.user));

      // ROLE ROUTING
      const role = data.user?.role;

      if (role === "superadmin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "editor") {
        navigate("/admin/editor", { replace: true });
      } else {
        navigate("/admin", { replace: true });
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Server not responding. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>

        <h2>Chef-Chi Admin Portal</h2>
        <p>CMS Dashboard Login</p>

        {error && <div className="auth-error">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />

        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
};

export default Login;