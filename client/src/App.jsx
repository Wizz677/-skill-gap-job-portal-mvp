import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { JobListPage } from './pages/JobListPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { JobSeekerDashboard } from './pages/JobSeekerDashboard';
import { EmployerDashboard } from './pages/EmployerDashboard';

function RequireAuth({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth role="job_seeker">
                <JobSeekerDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/employer"
            element={
              <RequireAuth role="employer">
                <EmployerDashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
