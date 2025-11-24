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
      setSuccessMsg("Register berhasil! Mengarahkan ke halaman login...");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Register gagal, coba lagi nanti."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-300/60 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            KoMpor <span className="text-blue-600">– Register</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Buat akun dulu supaya laporanmu tercatat rapi.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Nama</label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama panggilanmu"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="misal: anakkos@example.com"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/40 hover:bg-blue-700 transition transform hover:-translate-y-0.5"
          >
            Register
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
