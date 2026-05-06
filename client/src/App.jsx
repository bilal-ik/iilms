import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';

// Public pages
import Home from './pages/public/Home';
import InternshipListing from './pages/public/InternshipListing';
import InternshipDetail from './pages/public/InternshipDetail';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import EmailVerified from './pages/auth/EmailVerified';

// Profile
import MyProfile from './pages/profile/MyProfile';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import BrowseInternships from './pages/student/BrowseInternships';
import MyApplications from './pages/student/MyApplications';
import MyEvaluations from './pages/student/MyEvaluations';
import MyNotifications from './pages/student/MyNotifications';
import MyComplaints from './pages/student/MyComplaints';

// Company pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import ManageInternships from './pages/company/ManageInternships';
import InternshipForm from './pages/company/InternshipForm';
import ReviewApplications from './pages/company/ReviewApplications';

import MyCV from './pages/student/MyCV';
import AdminDashboard from './pages/admin/AdminDashboard';
import AllApplications from './pages/admin/AllApplications';
import AssignSupervisor from './pages/admin/AssignSupervisor';
import AllEvaluations from './pages/admin/AllEvaluations';
import RecommendationLetters from './pages/admin/RecommendationLetters';
import ManageComplaints from './pages/admin/ManageComplaints';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="page-container">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/internships" element={<InternshipListing />} />
            <Route path="/internships/:id" element={<InternshipDetail />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/email-verified" element={<EmailVerified />} />

            {/* Profile (any authenticated user) */}
            <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />

            {/* Student */}
            <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/browse" element={<ProtectedRoute allowedRoles={['student']}><BrowseInternships /></ProtectedRoute>} />
            <Route path="/student/applications" element={<ProtectedRoute allowedRoles={['student']}><MyApplications /></ProtectedRoute>} />
            <Route path="/student/evaluations" element={<ProtectedRoute allowedRoles={['student']}><MyEvaluations /></ProtectedRoute>} />
            <Route path="/student/notifications" element={<ProtectedRoute allowedRoles={['student']}><MyNotifications /></ProtectedRoute>} />
            <Route path="/student/complaints" element={<ProtectedRoute allowedRoles={['student']}><MyComplaints /></ProtectedRoute>} />
            <Route path="/student/cv" element={<ProtectedRoute allowedRoles={['student']}><MyCV /></ProtectedRoute>} />

            {/* Company */}
            <Route path="/company" element={<ProtectedRoute allowedRoles={['company']}><CompanyDashboard /></ProtectedRoute>} />
            <Route path="/company/internships" element={<ProtectedRoute allowedRoles={['company']}><ManageInternships /></ProtectedRoute>} />
            <Route path="/company/internships/new" element={<ProtectedRoute allowedRoles={['company']}><InternshipForm /></ProtectedRoute>} />
            <Route path="/company/internships/:id/edit" element={<ProtectedRoute allowedRoles={['company']}><InternshipForm /></ProtectedRoute>} />
            <Route path="/company/applications" element={<ProtectedRoute allowedRoles={['company']}><ReviewApplications /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/applications" element={<ProtectedRoute allowedRoles={['admin']}><AllApplications /></ProtectedRoute>} />
            <Route path="/admin/supervisors" element={<ProtectedRoute allowedRoles={['admin']}><AssignSupervisor /></ProtectedRoute>} />
            <Route path="/admin/evaluations" element={<ProtectedRoute allowedRoles={['admin']}><AllEvaluations /></ProtectedRoute>} />
            <Route path="/admin/recommendations" element={<ProtectedRoute allowedRoles={['admin']}><RecommendationLetters /></ProtectedRoute>} />
            <Route path="/admin/complaints" element={<ProtectedRoute allowedRoles={['admin']}><ManageComplaints /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
        <ChatBot />
      </BrowserRouter>
    </AuthProvider>
  );
}
