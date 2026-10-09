import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import FaqPage from "./pages/FaqPage";
import IntakePage from "./pages/IntakePage";
import ImpotsPage from "./pages/ImpotsPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminSubmissionsPage from "./pages/AdminSubmissionsPage";
import AdminConfirmationsPage from "./pages/AdminConfirmationsPage";
import AdminActivityLogsPage from "./pages/AdminActivityLogsPage";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AccessRequestPage from "./pages/AccessRequestPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import ConfirmClientPage, { ConfirmClientSuccessPage } from "./pages/ConfirmClientPage";
import OuvertureDossierPage from "./pages/OuvertureDossierPage";
import TestFormPage from "./pages/TestFormPage";
import TestForm2Page from "./pages/TestForm2Page";

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
      <Route path="/confirm-client" element={<ConfirmClientPage />} />
      <Route path="/confirm-client/confirmation" element={<ConfirmClientSuccessPage />} />
      <Route path="/test-form" element={<TestFormPage />} />
      <Route path="/test-fom-2" element={<TestForm2Page />} />
      <Route path="/test-form-2" element={<TestForm2Page />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/confirmations" element={<ProtectedAdminRoute><AdminConfirmationsPage /></ProtectedAdminRoute>} />

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
