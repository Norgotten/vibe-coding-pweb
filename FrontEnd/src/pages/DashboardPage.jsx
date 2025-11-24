import { Link } from "react-router-dom";

function DashboardPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>KoMpor – Dashboard Laporan</h1>
      <p>Nanti di sini bakal tampil list semua laporan.</p>

      <Link to="/reports/new">+ Buat Laporan Baru</Link>
    </div>
  );
}

export default DashboardPage;
