import { Navigate, Route, Routes } from "react-router";

import MainLayout from "../layouts/MainLayout";
import withAuth from "../hoc/withAuth";

import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import AirportsPage from "../pages/airports/AirportsPage";
import FavoritesPage from "../pages/favorites/FavoritesPage";
import ReportsPage from "../pages/reports/ReportsPage";
import AirportDetailsPage from "../pages/airports/AirportDetailsPage";

const ProtectedMainLayout = withAuth(MainLayout);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedMainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/airports" element={<AirportsPage />} />
        <Route path="airports/:id" element={<AirportDetailsPage />} />

        <Route path="/favorites" element={<FavoritesPage />} />

        <Route path="/reports" element={<ReportsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
