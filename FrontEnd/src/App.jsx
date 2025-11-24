import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ReportFormPage from "./pages/ReportFormPage.jsx";
import RequireAuth from "./RequireAuth.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/reports/new"
        element={
          <RequireAuth>
            <ReportFormPage mode="create" />
          </RequireAuth>
        }
      />
      <Route
        path="/reports/:id/edit"
        element={
          <RequireAuth>
            <ReportFormPage mode="edit" />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
