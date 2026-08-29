import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Assignments from "./pages/Assignments";
import Exams from "./pages/Exams";
import Skills from "./pages/Skills";
import AuthRedirect from './pages/AuthRedirect'
import Internships from "./pages/Internships";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import AdminUsers from './pages/AdminUsers'
import AdminSubjects from './pages/AdminSubjects'
import AdminAssignments from './pages/AdminAssignments'
import AdminExams from './pages/AdminExams'
import AdminSkills from './pages/AdminSkills'
import AdminInternships from './pages/AdminInternships'
import AdminProfile from './pages/AdminProfile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth-redirect" element={<AuthRedirect />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <AdminUsers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/subjects"
          element={
            <AdminProtectedRoute>
              <AdminSubjects />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/assignments"
          element={
            <AdminProtectedRoute>
              <AdminAssignments />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/exams"
          element={
            <AdminProtectedRoute>
              <AdminExams />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/skills"
          element={
            <AdminProtectedRoute>
              <AdminSkills />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/internships"
          element={
            <AdminProtectedRoute>
              <AdminInternships />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminProtectedRoute>
              <AdminProfile />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exams"
          element={
            <ProtectedRoute>
              <Exams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/skills"
          element={
            <ProtectedRoute>
              <Skills />
            </ProtectedRoute>
          }
        />

        <Route
          path="/internships"
          element={
            <ProtectedRoute>
              <Internships />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <Subjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <Assignments />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
