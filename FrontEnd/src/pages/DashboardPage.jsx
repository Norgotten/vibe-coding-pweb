import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api";

function DashboardPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/reports");
      setReports(res.data);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data laporan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleLogout = () => {
    setAuthToken(null); // hapus token & header
    localStorage.removeItem("kompor_user");
    navigate("/login");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin mau hapus laporan ini?")) return;
    try {
      await api.delete(`/reports/${id}`);
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus laporan.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h1>KoMpor – Dashboard Laporan</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <button
        onClick={() => navigate("/reports/new")}
        style={{ marginBottom: "1rem" }}
      >
        + Buat Laporan Baru
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && reports.length === 0 && <p>Belum ada laporan.</p>}

      <div style={{ display: "grid", gap: "1rem" }}>
        {reports.map((report) => (
          <div
            key={report._id}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              borderRadius: "8px",
              display: "flex",
              gap: "1rem",
            }}
          >
            {report.imageUrl && (
              <img
                src={`http://localhost:5000/uploads/${report.imageUrl}`}
                alt={report.title}
                style={{ width: "120px", height: "90px", objectFit: "cover" }}
              />
            )}
            <div style={{ flexGrow: 1 }}>
              <h3>{report.title}</h3>
              <p>Kamar: {report.room}</p>
              <p>Urgensi: {report.urgency}</p>
              <p>Status: {report.status}</p>
              <p style={{ fontSize: "0.8rem", color: "#555" }}>
                Dibuat: {new Date(report.createdAt).toLocaleString()}
              </p>
              <div style={{ marginTop: "0.5rem" }}>
                <button
                  onClick={() => navigate(`/reports/${report._id}/edit`)}
                  style={{ marginRight: "0.5rem" }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(report._id)}>Hapus</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
