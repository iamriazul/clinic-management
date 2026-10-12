import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import {
  Users, UserCog, CalendarDays, Clock, CheckCircle,
  XCircle, TrendingUp, UserPlus, CalendarCheck, ArrowRight
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-gray-900 mb-1">{value ?? '—'}</p>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
    </div>
  );
}

export default function DashboardHome() {
  const { user, isAdmin, isDoctor, isReceptionist, isPatient } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await dashboardAPI.getStats();
      setStats(res.data);
    } catch (err) {
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner border-pink-500 w-8 h-8 mx-auto mb-3"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-2xl text-red-600 border border-red-100">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8" id="dashboard-home">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2"></div>
        <div className="relative z-10">
          <p className="text-pink-100 text-sm font-medium mb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
            Good {getGreeting()}, {user?.first_name || user?.username}! 👋
          </h1>
          <p className="text-pink-100">
            {getRoleMessage(user?.role)}
          </p>
        </div>
      </div>

      {/* Admin Dashboard */}
      {isAdmin && stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={UserCog} label="Total Doctors" value={stats.total_doctors} color="bg-pink-500" delay={0.1} />
            <StatCard icon={Users} label="Total Patients" value={stats.total_patients} color="bg-violet-500" delay={0.2} />
            <StatCard icon={CalendarDays} label="Today's Appointments" value={stats.todays_appointments} color="bg-blue-500" delay={0.3} />
            <StatCard icon={Clock} label="Pending Appointments" value={stats.pending_appointments} color="bg-amber-500" delay={0.4} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <StatCard icon={CheckCircle} label="Confirmed" value={stats.confirmed_appointments} color="bg-emerald-500" delay={0.5} />
            <StatCard icon={TrendingUp} label="Completed" value={stats.completed_appointments} color="bg-teal-500" delay={0.6} />
            <StatCard icon={XCircle} label="Cancelled" value={stats.cancelled_appointments} color="bg-red-500" delay={0.7} />
          </div>
          {stats.recent_appointments?.length > 0 && (
            <RecentAppointments appointments={stats.recent_appointments} />
          )}
        </>
      )}

      {/* Doctor Dashboard */}
      {isDoctor && stats && (
        <>
          {stats.error && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm">
              ⚠️ {stats.error} Ask an admin to link your doctor profile to this account.
            </div>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={CalendarDays} label="Today's Appointments" value={stats.todays_appointments} color="bg-pink-500" delay={0.1} />
            <StatCard icon={Clock} label="Upcoming" value={stats.upcoming_appointments} color="bg-blue-500" delay={0.2} />
            <StatCard icon={Users} label="Total Patients" value={stats.total_patients} color="bg-violet-500" delay={0.3} />
            <StatCard icon={CheckCircle} label="Completed" value={stats.completed_appointments} color="bg-emerald-500" delay={0.4} />
          </div>
          <QuickActions role="doctor" />
        </>
      )}

      {/* Receptionist Dashboard */}
      {isReceptionist && stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={CalendarDays} label="Today's Appointments" value={stats.todays_appointments} color="bg-pink-500" delay={0.1} />
            <StatCard icon={Clock} label="Pending" value={stats.pending_appointments} color="bg-amber-500" delay={0.2} />
            <StatCard icon={Users} label="Total Patients" value={stats.total_patients} color="bg-violet-500" delay={0.3} />
            <StatCard icon={UserCog} label="Total Doctors" value={stats.total_doctors} color="bg-blue-500" delay={0.4} />
          </div>
          {stats.recent_appointments?.length > 0 && (
            <RecentAppointments appointments={stats.recent_appointments} />
          )}
          <QuickActions role="receptionist" />
        </>
      )}

      {/* Patient Dashboard */}
      {isPatient && stats && (
        <>
          {stats.error && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm">
              ⚠️ {stats.error} Please complete your patient profile.
            </div>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={CalendarDays} label="Total Appointments" value={stats.total_appointments} color="bg-pink-500" delay={0.1} />
            <StatCard icon={Clock} label="Upcoming" value={stats.upcoming_appointments} color="bg-blue-500" delay={0.2} />
            <StatCard icon={CheckCircle} label="Completed" value={stats.completed_appointments} color="bg-emerald-500" delay={0.3} />
            <StatCard icon={XCircle} label="Cancelled" value={stats.cancelled_appointments} color="bg-red-500" delay={0.4} />
          </div>
          <QuickActions role="patient" />
        </>
      )}
    </div>
  );
}

function RecentAppointments({ appointments }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <CalendarDays size={18} className="text-pink-500" /> Recent Appointments
        </h3>
        <Link to="/dashboard/appointments" className="text-sm text-pink-500 font-semibold hover:text-pink-600 flex items-center gap-1">
          View All <ArrowRight size={14} />
        </Link>
      </div>
      <div className="divide-y divide-gray-50">
        {appointments.map((apt) => (
          <div key={apt.id} className="flex items-center gap-4 px-6 py-3 hover:bg-pink-50/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-sm flex-shrink-0">
              {apt.patient_name?.[0] || 'P'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{apt.patient_name}</p>
              <p className="text-xs text-gray-500">Dr. {apt.doctor_name} · {apt.appointment_date}</p>
            </div>
            <StatusBadge status={apt.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions({ role }) {
  const actions = {
    patient: [
      { to: '/appointments/book', icon: CalendarDays, label: 'Book Appointment', color: 'bg-pink-500' },
      { to: '/dashboard/appointments', icon: CalendarCheck, label: 'My Appointments', color: 'bg-blue-500' },
    ],
    doctor: [
      { to: '/dashboard/appointments', icon: CalendarDays, label: 'My Appointments', color: 'bg-pink-500' },
      { to: '/dashboard/patients', icon: Users, label: 'My Patients', color: 'bg-violet-500' },
    ],
    receptionist: [
      { to: '/dashboard/patients', icon: UserPlus, label: 'Register Patient', color: 'bg-pink-500' },
      { to: '/appointments/book', icon: CalendarDays, label: 'Book Appointment', color: 'bg-blue-500' },
      { to: '/dashboard/appointments', icon: CalendarCheck, label: "Today's Appointments", color: 'bg-emerald-500' },
    ],
  };

  const items = actions[role] || [];
  if (!items.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in">
      <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-pink-200 hover:bg-pink-50/50 transition-all duration-200 group"
          >
            <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
              <item.icon size={20} className="text-white" />
            </div>
            <span className="font-semibold text-gray-700 text-sm">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

function getRoleMessage(role) {
  const messages = {
    admin: "Here's a complete overview of your clinic operations.",
    doctor: "Here are your upcoming appointments and patient summaries.",
    receptionist: "Ready to assist patients and manage today's schedule.",
    patient: "Track your appointments and manage your healthcare journey.",
  };
  return messages[role] || "Welcome to your dashboard.";
}
