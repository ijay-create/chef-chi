import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";

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
      const res = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      // ❌ LOGIN FAILED
      if (!res.ok) {
        setError(data?.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      // ✅ STORE REAL CMS SESSION (NO FALLBACKS)
      localStorage.setItem("cms-token", data.token);
      localStorage.setItem("admin-user", JSON.stringify(data.user));

      // optional flag (only for UI checks if needed)
      localStorage.setItem("admin-auth", "true");

      // 🚀 redirect to admin dashboard
      navigate("/admin", { replace: true });

    } catch (err) {
      console.error("Login error:", err);
      setError("Server not responding. Make sure backend is running on port 5001");
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
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
};

export default Login;