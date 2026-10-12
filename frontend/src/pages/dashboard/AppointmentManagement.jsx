import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentAPI, doctorAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  CalendarDays, X, CheckCircle, XCircle, Clock, Plus
} from 'lucide-react';

const STATUS_OPTIONS = ['', 'pending', 'confirmed', 'completed', 'cancelled'];

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', date: '', doctor: '' });
  const [doctors, setDoctors] = useState([]);
  const [actionModal, setActionModal] = useState({ open: false, appointment: null, newStatus: '' });
  const [cancelDialog, setCancelDialog] = useState({ open: false, appointment: null });
  const { showToast } = useToast();
  const { isAdmin, isReceptionist, isDoctor, isPatient } = useAuth();

  const canChangeStatus = isAdmin || isReceptionist;
  const canCancel = isAdmin || isReceptionist;

  useEffect(() => {
    fetchAppointments();
    if (isAdmin || isReceptionist) {
      fetchDoctors();
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.date) params.date = filters.date;
      if (filters.doctor) params.doctor = filters.doctor;
      const res = await appointmentAPI.list(params);
      setAppointments(res.data);
    } catch {
      showToast('Failed to load appointments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await doctorAPI.list();
      setDoctors(res.data);
    } catch { /* silent */ }
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearFilters = () => setFilters({ status: '', date: '', doctor: '' });

  const openStatusChange = (appointment, newStatus) => {
    setActionModal({ open: true, appointment, newStatus });
  };

  const confirmStatusChange = async () => {
    const { appointment, newStatus } = actionModal;
    setActionModal({ open: false, appointment: null, newStatus: '' });
    try {
      await appointmentAPI.update(appointment.id, { status: newStatus });
      showToast(`Appointment ${newStatus}!`, 'success');
      fetchAppointments();
    } catch {
      showToast('Failed to update status.', 'error');
    }
  };

  const confirmCancel = async () => {
    const { appointment } = cancelDialog;
    setCancelDialog({ open: false, appointment: null });
    try {
      await appointmentAPI.delete(appointment.id);
      showToast('Appointment cancelled.', 'success');
      fetchAppointments();
    } catch {
      showToast('Failed to cancel appointment.', 'error');
    }
  };

  const hasActiveFilters = filters.status || filters.date || filters.doctor;

  return (
    <div className="space-y-6" id="appointment-management">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Appointments</h2>
          <p className="text-sm text-gray-500 mt-1">
            {isPatient ? 'Your appointment history' : 'View and manage all appointments'}
          </p>
        </div>
        <Link to="/appointments/book" className="btn-primary text-sm py-2.5 gap-2">
          <Plus size={18} /> Book Appointment
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Status Filter */}
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Status</label>
            <select
              name="status"
              className="input-field text-sm"
              value={filters.status}
              onChange={handleFilterChange}
              id="filter-status"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.filter(Boolean).map((s) => (
                <option key={s} value={s} className="capitalize">{s}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Date</label>
            <input
              type="date"
              name="date"
              className="input-field text-sm"
              value={filters.date}
              onChange={handleFilterChange}
              id="filter-date"
            />
          </div>

          {/* Doctor Filter */}
          {(isAdmin || isReceptionist) && (
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Doctor</label>
              <select
                name="doctor"
                className="input-field text-sm"
                value={filters.doctor}
                onChange={handleFilterChange}
                id="filter-doctor"
              >
                <option value="">All Doctors</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>Dr. {d.name}</option>
                ))}
              </select>
            </div>
          )}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              id="clear-filters-btn"
            >
              <X size={16} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Summary Chips */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: 'Total', value: appointments.length, color: 'bg-gray-100 text-gray-600' },
          { label: 'Pending', value: appointments.filter(a => a.status === 'pending').length, color: 'bg-amber-100 text-amber-700' },
          { label: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length, color: 'bg-blue-100 text-blue-700' },
          { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, color: 'bg-emerald-100 text-emerald-700' },
        ].map((chip) => (
          <span key={chip.label} className={`px-4 py-1.5 rounded-full text-sm font-semibold ${chip.color}`}>
            {chip.label}: {chip.value}
          </span>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="spinner border-pink-500 w-8 h-8"></div>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {!isPatient && <th>Patient</th>}
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={isPatient ? 5 : 6} className="text-center py-16 text-gray-400">
                    <CalendarDays size={40} className="mx-auto mb-3 text-gray-200" />
                    No appointments found.
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id} className="animate-fade-in">
                    {!isPatient && (
                      <td>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{apt.patient_name}</p>
                          <p className="text-xs text-gray-400">{apt.patient_id_display}</p>
                        </div>
                      </td>
                    )}
                    <td>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Dr. {apt.doctor_name}</p>
                        <p className="text-xs text-gray-400">{apt.doctor_specialization}</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{apt.appointment_date}</p>
                        <p className="text-xs text-gray-400">{apt.appointment_time}</p>
                      </div>
                    </td>
                    <td>
                      <p className="text-sm text-gray-600 max-w-[150px] truncate" title={apt.reason}>
                        {apt.reason || '—'}
                      </p>
                    </td>
                    <td>
                      <StatusBadge status={apt.status} />
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        {/* Admin/Receptionist can confirm pending */}
                        {canChangeStatus && apt.status === 'pending' && (
                          <button
                            onClick={() => openStatusChange(apt, 'confirmed')}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Confirm"
                            id={`confirm-apt-${apt.id}`}
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        {/* Admin/Receptionist can mark confirmed as completed */}
                        {canChangeStatus && apt.status === 'confirmed' && (
                          <button
                            onClick={() => openStatusChange(apt, 'completed')}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Mark Completed"
                            id={`complete-apt-${apt.id}`}
                          >
                            <Clock size={16} />
                          </button>
                        )}
                        {/* Doctor can mark their own confirmed as completed */}
                        {isDoctor && apt.status === 'confirmed' && (
                          <button
                            onClick={() => openStatusChange(apt, 'completed')}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Mark Completed"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        {/* Cancel */}
                        {canCancel && apt.status !== 'cancelled' && apt.status !== 'completed' && (
                          <button
                            onClick={() => setCancelDialog({ open: true, appointment: apt })}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            title="Cancel"
                            id={`cancel-apt-${apt.id}`}
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        {/* Patient can cancel their own pending */}
                        {isPatient && apt.status === 'pending' && (
                          <button
                            onClick={() => setCancelDialog({ open: true, appointment: apt })}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            title="Cancel"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Status Change Confirm */}
      <ConfirmDialog
        isOpen={actionModal.open}
        title={`${actionModal.newStatus === 'confirmed' ? 'Confirm' : 'Complete'} Appointment`}
        message={`Are you sure you want to mark this appointment as "${actionModal.newStatus}"?`}
        onConfirm={confirmStatusChange}
        onCancel={() => setActionModal({ open: false, appointment: null, newStatus: '' })}
        type="warning"
      />

      {/* Cancel Confirm */}
      <ConfirmDialog
        isOpen={cancelDialog.open}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        onConfirm={confirmCancel}
        onCancel={() => setCancelDialog({ open: false, appointment: null })}
        type="danger"
      />
    </div>
  );
}
