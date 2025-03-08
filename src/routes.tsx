import { Navigate, RouteObject } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import DashboardPage from "./components/dashboard/DashboardPage";
import PatientsPage from "./components/patients/PatientsPage";
import PatientForm from "./components/patients/PatientForm";
import PatientRegistration from "./components/patients/PatientRegistration";
import TestsPage from "./components/tests/TestsPage";
import TestsForm from "./components/tests/TestsForm";
import ResultsPage from "./components/results/ResultsPage";
import TestResultEntry from "./components/results/TestResultEntry";
import SearchPage from "./components/search/SearchPage";
import StatisticsPage from "./components/statistics/StatisticsPage";
import DoctorsManagement from "./components/doctors/DoctorsManagement";
import LabSettings from "./components/settings/LabSettings";
import MainMenu from "./components/home/MainMenu";
import LoginPage from "./components/auth/LoginPage";
import SupabaseAuth from "./components/auth/SupabaseAuth";
import AuthGuard from "./components/auth/AuthGuard";

const routes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/auth",
    element: <SupabaseAuth />,
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <MainMenu />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "patients",
        element: <PatientsPage />,
      },
      {
        path: "patients/new",
        element: <PatientForm />,
      },
      {
        path: "patient-registration",
        element: <PatientRegistration />,
      },
      {
        path: "tests",
        element: <TestsPage />,
      },
      {
        path: "tests/manage",
        element: <TestsForm />,
      },
      {
        path: "results",
        element: <ResultsPage />,
      },
      {
        path: "results/entry",
        element: <TestResultEntry />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "statistics",
        element: <StatisticsPage />,
      },
      {
        path: "doctors",
        element: <DoctorsManagement />,
      },
      {
        path: "settings",
        element: <LabSettings />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
];

export default routes;
