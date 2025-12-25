import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg text-indigo-600">
          ApplySmart
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <NavLink to="/jobs" className={({ isActive }) => (isActive ? 'text-indigo-600' : 'text-gray-700')}>
            Jobs
          </NavLink>
          {user?.role === 'job_seeker' && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? 'text-indigo-600' : 'text-gray-700')}
            >
              My Applications
            </NavLink>
          )}
          {user?.role === 'employer' && (
            <NavLink
              to="/employer"
              className={({ isActive }) => (isActive ? 'text-indigo-600' : 'text-gray-700')}
            >
              Employer Dashboard
            </NavLink>
          )}
          {user ? (
            <>
              <span className="text-gray-600">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? 'text-indigo-600' : 'text-gray-700')}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) => (isActive ? 'text-indigo-600' : 'text-gray-700')}
              >
                Signup
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
