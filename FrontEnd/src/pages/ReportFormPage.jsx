import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

function ReportFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [room, setRoom] = useState("");
  const [urgency, setUrgency] = useState("Low");
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(mode === "edit");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      if (mode !== "edit" || !id) return;
      try {
        setLoading(true);
        const res = await api.get(`/reports/${id}`);
        const r = res.data;
        setTitle(r.title || "");
        setDescription(r.description || "");
        setRoom(r.room || "");
        setUrgency(r.urgency || "Low");
        setExistingImage(r.imageUrl || "");
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data laporan.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [mode, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("room", room);
      formData.append("urgency", urgency);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (mode === "edit" && id) {
        await api.put(`/reports/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/reports", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan laporan. Coba lagi.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        Loading data laporan...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {mode === "edit" ? "Edit Laporan" : "Buat Laporan Baru"}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Ceritakan masalahnya dengan jelas supaya pemilik kos gampang
                follow up.
              </p>
            </div>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-100"
              onClick={() => navigate("/dashboard")}
            >
              Kembali
            </button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="space-y-1">
              <label className="font-medium text-slate-700">Judul</label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Wastafel bau, AC bocor, Lampu mati"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">Deskripsi</label>
              <textarea
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 min-h-[80px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan waktu kejadian, seberapa parah, dsb."
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">
                Nomor kamar / lokasi
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Misal: B12, Dapur lantai 2"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">Urgensi</label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
              >
                <option value="Low">Low – bisa nunggu</option>
                <option value="Medium">Medium – cukup penting</option>
                <option value="High">High – butuh ditangani cepat</option>
              </select>
            </div>

            {mode === "edit" && existingImage && (
              <div className="space-y-1">
                <label className="font-medium text-slate-700">
                  Foto saat ini
                </label>
                <div>
                  <img
                    src={`http://localhost:5000/uploads/${existingImage}`}
                    alt={title}
                    className="h-32 w-48 rounded-xl border border-slate-200 object-cover"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="font-medium text-slate-700">
                Foto baru (opsional)
              </label>
              <input
                type="file"
                accept="image/*"
                className="block text-xs text-slate-600"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <p className="text-[11px] text-slate-400">
                Kalau tidak diisi, foto lama akan tetap digunakan.
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow shadow-blue-600/40 hover:bg-blue-700"
              >
                {mode === "edit" ? "Simpan Perubahan" : "Buat Laporan"}
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                onClick={() => navigate("/dashboard")}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportFormPage;
