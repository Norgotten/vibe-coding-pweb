import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    setAuthToken(null);
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

  const urgencyClass = (u) => {
    if (u === "High") return "bg-red-50 text-red-700";
    if (u === "Medium") return "bg-amber-50 text-amber-700";
    return "bg-emerald-50 text-emerald-700";
  };

  const statusClass = (s) => {
    if (s === "Pending") return "bg-blue-50 text-blue-700";
    if (s === "In Progress") return "bg-indigo-50 text-indigo-700";
    return "bg-emerald-50 text-emerald-700";
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              KoMpor – Dashboard Laporan
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Kelola semua laporan kerusakan dan kekacauan di kosmu.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 bg-white"
          >
            Logout
          </button>
        </div>

        {/* Action bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex justify-between items-center">
          <div className="text-sm text-slate-500">
            Total laporan:{" "}
            <span className="font-semibold text-slate-800">
              {reports.length}
            </span>
          </div>
          <button
            onClick={() => navigate("/reports/new")}
            className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow shadow-blue-600/40 hover:bg-blue-700 transition"
          >
            + Buat Laporan Baru
          </button>
        </div>

        {/* List laporan */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          {loading && (
            <p className="text-sm text-slate-500">Loading data laporan...</p>
          )}

          {error && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && reports.length === 0 && (
            <p className="text-sm text-slate-500">Belum ada laporan.</p>
          )}

          {!loading && reports.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2">
              {reports.map((r) => (
                <div
                  key={r._id}
                  className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 hover:bg-slate-50 transition"
                >
                  {r.imageUrl && (
                    <img
                      src={`http://localhost:5000/uploads/${r.imageUrl}`}
                      alt={r.title}
                      className="h-24 w-28 rounded-lg object-cover border border-slate-200"
                    />
                  )}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {r.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Kamar/Lokasi:{" "}
                        <span className="font-medium">{r.room}</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${urgencyClass(
                            r.urgency
                          )}`}
                        >
                          Urgensi: {r.urgency}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusClass(
                            r.status
                          )}`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Dibuat:{" "}
                        {new Date(r.createdAt).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>

                    <div className="mt-2 flex gap-1.5">
                      <button
                        onClick={() => navigate(`/reports/${r._id}/edit`)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="rounded-full bg-red-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
