import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import ApplicationPage from "@/pages/ApplicationPage";
import AgreementPage from "@/pages/AgreementPage";
import ThankYouPage from "@/pages/ThankYouPage";
import AdminPage from "@/pages/AdminPage";
import StatusPage from "@/pages/StatusPage";
import NotFound from "@/pages/NotFound";
import WelcomePage from "@/pages/WelcomePage";
import RegisterPage from "@/pages/RegisterPage";
import TechnicalDepartmentPage from "@/pages/TechnicalDepartmentPage";

export default function App() {
  return (
    <Routes>
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/apply" element={<ApplicationPage />} />
      <Route path="/agreement" element={<AgreementPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/status" element={<StatusPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/technical-department" element={<TechnicalDepartmentPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
