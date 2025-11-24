import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      const { token, user } = res.data;

      // simpan token & (opsional) user
      setAuthToken(token);
      localStorage.setItem("kompor_user", JSON.stringify(user));

      // pindah ke dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Login gagal, cek email / password."
      );
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 400, margin: "0 auto" }}>
      <h1>KoMpor – Login</h1>

      {error && (
        <p style={{ color: "red", marginTop: "0.5rem" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <div style={{ marginBottom: "0.75rem" }}>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button
          type="submit"
          style={{ padding: "0.5rem 1rem", marginTop: "0.5rem" }}
        >
          Login
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Belum punya akun? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default LoginPage;
