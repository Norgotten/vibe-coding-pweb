import { useParams } from "react-router-dom";

function ReportFormPage({ mode }) {
  const { id } = useParams();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>
        {mode === "edit" ? `Edit Laporan (${id})` : "Buat Laporan Baru"}
      </h1>
      <p>Halaman form laporan (nanti diisi form + upload file)</p>
    </div>
  );
}

export default ReportFormPage;
