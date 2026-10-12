import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  LayoutDashboard, Users, UserCog, CalendarDays, Heart,
  LogOut, Menu, X, ChevronRight, Home, Bell
} from 'lucide-react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin, isDoctor, isReceptionist, isPatient } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully.', 'success');
      navigate('/');
    } catch {
      showToast('Logout failed.', 'error');
    }
  };

  // Build sidebar links based on role
  const sidebarLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'doctor', 'receptionist', 'patient'] },
    { to: '/dashboard/doctors', icon: UserCog, label: 'Doctors', roles: ['admin'] },
    { to: '/dashboard/patients', icon: Users, label: 'Patients', roles: ['admin', 'receptionist', 'doctor'] },
    { to: '/dashboard/appointments', icon: CalendarDays, label: 'Appointments', roles: ['admin', 'doctor', 'receptionist', 'patient'] },
  ];

  const visibleLinks = sidebarLinks.filter(link => link.roles.includes(user?.role));

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" id="dashboard-layout">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-xl lg:shadow-sm border-r border-gray-100 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        id="dashboard-sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl gradient-pink-aqua flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Medi<span className="gradient-text">Care</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {visibleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`sidebar-link ${isActive(link.to) ? 'active' : ''}`}
              >
                <link.icon size={20} />
                <span>{link.label}</span>
                {isActive(link.to) && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            ))}
          </nav>

          {/* Back to Homepage */}
          <div className="px-4 pb-2">
            <Link
              to="/"
              className="sidebar-link text-gray-500 hover:text-pink-600"
            >
              <Home size={20} />
              <span>Back to Homepage</span>
            </Link>
          </div>

          {/* User Info & Logout */}
          <div className="px-4 py-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-10 h-10 rounded-xl gradient-pink-aqua flex items-center justify-center text-white font-bold text-sm">
                {user?.first_name?.[0] || user?.username?.[0] || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
              id="logout-btn"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 h-16 flex items-center px-4 lg:px-8" id="dashboard-topbar">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4 text-gray-600 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>

          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">
              {getPageTitle(location.pathname)}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-gray-500">
              Welcome, <span className="font-semibold text-gray-800">{user?.first_name || user?.username}</span>
            </span>
            <div className="w-9 h-9 rounded-xl gradient-pink-aqua flex items-center justify-center text-white font-bold text-sm">
              {user?.first_name?.[0] || user?.username?.[0] || '?'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function getPageTitle(path) {
  const titles = {
    '/dashboard': 'Dashboard',
    '/dashboard/doctors': 'Doctor Management',
    '/dashboard/patients': 'Patient Management',
    '/dashboard/appointments': 'Appointment Management',
  };
  return titles[path] || 'Dashboard';
}
