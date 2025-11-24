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

  // Kalau mode edit → ambil data awal
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

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: 500, margin: "0 auto" }}>
      <h1>{mode === "edit" ? "Edit Laporan" : "Buat Laporan Baru"}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <div style={{ marginBottom: "0.75rem" }}>
          <label>Judul</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label>Deskripsi</label>
          <br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label>Kamar</label>
          <br />
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label>Urgensi</label>
          <br />
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {mode === "edit" && existingImage && (
          <div style={{ marginBottom: "0.75rem" }}>
            <p>Foto saat ini:</p>
            <img
              src={`http://localhost:5000/uploads/${existingImage}`}
              alt={title}
              style={{ width: "150px", height: "110px", objectFit: "cover" }}
            />
          </div>
        )}

        <div style={{ marginBottom: "0.75rem" }}>
          <label>Foto (opsional, bisa dikosongin)</label>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          {mode === "edit" ? "Simpan Perubahan" : "Buat Laporan"}
        </button>
      </form>
    </div>
  );
}

export default ReportFormPage;
