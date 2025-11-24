import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      await api.post("/auth/register", { name, email, password });

      setSuccessMsg("Register berhasil! Silakan login.");
      // opsional: langsung navigate ke login
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Register gagal, coba lagi."
      );
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 400, margin: "0 auto" }}>
      <h1>KoMpor – Register</h1>

      {error && (
        <p style={{ color: "red", marginTop: "0.5rem" }}>
          {error}
        </p>
      )}
      {successMsg && (
        <p style={{ color: "green", marginTop: "0.5rem" }}>
          {successMsg}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <div style={{ marginBottom: "0.75rem" }}>
          <label>Nama</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

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
          Register
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Sudah punya akun? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
