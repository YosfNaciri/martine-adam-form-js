import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import FaqPage from "./pages/FaqPage";
import IntakePage from "./pages/IntakePage";
import ImpotsPage from "./pages/ImpotsPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminSubmissionsPage from "./pages/AdminSubmissionsPage";
import AdminActivityLogsPage from "./pages/AdminActivityLogsPage";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AccessRequestPage from "./pages/AccessRequestPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import OuvertureDossierPage from "./pages/OuvertureDossierPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/impots" element={<ImpotsPage />} />
      <Route path="/nous-rejoindre" element={<IntakePage />} />
      <Route path="/demande-acces" element={<AccessRequestPage />} />
      <Route path="/ouverture-dossier" element={<OuvertureDossierPage />} />
      <Route path="/confirmation" element={<ConfirmationPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminDashboardPage />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboardPage />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/submissions"
        element={
          <ProtectedAdminRoute>
            <AdminSubmissionsPage />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/logs"
        element={
          <ProtectedAdminRoute>
            <AdminActivityLogsPage />
          </ProtectedAdminRoute>
        }
      />
    </Routes>
  );
}
