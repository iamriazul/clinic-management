import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { doctorAPI, appointmentAPI, patientAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CalendarDays, Clock, User, FileText, CheckCircle } from 'lucide-react';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00',
];

export default function BookAppointmentPage() {
  const { isAuthenticated, isPatient, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [patientProfile, setPatientProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    doctor: '',
    appointment_date: '',
    appointment_time: '',
    reason: '',
    patient: '',
  });
  const [errors, setErrors] = useState({});

  // Minimum date = today
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchDoctors();
    if (isAuthenticated && isPatient) {
      fetchPatientProfile();
    }
  }, [isAuthenticated, isPatient]);

  useEffect(() => {
    if (form.doctor && form.appointment_date) {
      fetchBookedSlots();
    }
  }, [form.doctor, form.appointment_date]);

  const fetchDoctors = async () => {
    try {
      const res = await doctorAPI.list();
      setDoctors(res.data);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  };

  const fetchPatientProfile = async () => {
    try {
      const res = await patientAPI.list();
      const myProfile = res.data.find((p) => p.user === user?.id) || res.data[0];
      if (myProfile) {
        setPatientProfile(myProfile);
        setForm((prev) => ({ ...prev, patient: myProfile.id }));
      }
    } catch (err) {
      console.error('No patient profile:', err);
    }
  };

  const fetchBookedSlots = async () => {
    setLoadingSlots(true);
    try {
      const res = await appointmentAPI.getSlots(form.doctor, form.appointment_date);
      setBookedSlots(res.data.booked_slots || []);
    } catch {
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'doctor' || name === 'appointment_date') {
      setForm((prev) => ({ ...prev, [name]: value, appointment_time: '' }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const payload = {
        doctor: form.doctor,
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time + ':00',
        reason: form.reason,
        patient: form.patient,
      };
      await appointmentAPI.create(payload);
      setSuccess(true);
      showToast('Appointment booked successfully!', 'success');
    } catch (err) {
      const errData = err.response?.data;
      if (typeof errData === 'object') {
        setErrors(errData);
      } else {
        setErrors({ non_field_errors: ['Failed to book appointment. Please try again.'] });
      }
    } finally {
      setLoading(false);
    }
  };

  const getError = (field) => {
    const err = errors[field];
    return Array.isArray(err) ? err[0] : err;
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50" id="book-appointment-page">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-16">
          <div className="bg-white rounded-3xl p-12 shadow-xl text-center max-w-md mx-4 animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Appointment Booked!</h2>
            <p className="text-gray-500 mb-8">Your appointment has been successfully scheduled. You'll be notified when it's confirmed.</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setSuccess(false); setForm({ doctor: '', appointment_date: '', appointment_time: '', reason: '', patient: patientProfile?.id || '' }); }}
                className="btn-primary justify-center"
              >
                Book Another
              </button>
              {isAuthenticated ? (
                <Link to="/dashboard/appointments" className="btn-outline justify-center">View My Appointments</Link>
              ) : (
                <Link to="/" className="btn-outline justify-center">Go Home</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" id="book-appointment-page">
      <Navbar />

      {/* Header */}
      <div className="hero-gradient pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Book an <span className="gradient-text">Appointment</span>
          </h1>
          <p className="text-gray-300">
            Choose your doctor, pick a date and time, and we'll take care of the rest.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 -mt-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 animate-fade-in">
          {!isAuthenticated && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
              <strong>Note:</strong> You need to{' '}
              <Link to="/login" className="font-bold underline">log in</Link>{' '}
              to complete booking. You can still browse options below.
            </div>
          )}

          {errors.non_field_errors && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {errors.non_field_errors[0] || errors.non_field_errors}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Doctor Select */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User size={16} className="text-pink-500" /> Select Doctor
              </label>
              <select
                name="doctor"
                className={`input-field ${getError('doctor') ? 'border-red-400' : ''}`}
                value={form.doctor}
                onChange={handleChange}
                required
                id="book-doctor-select"
              >
                <option value="">-- Choose a Doctor --</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.name} — {d.specialization} (${d.consultation_fee})
                  </option>
                ))}
              </select>
              {getError('doctor') && <p className="text-xs text-red-500 mt-1">{getError('doctor')}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <CalendarDays size={16} className="text-pink-500" /> Appointment Date
              </label>
              <input
                type="date"
                name="appointment_date"
                className={`input-field ${getError('appointment_date') ? 'border-red-400' : ''}`}
                value={form.appointment_date}
                onChange={handleChange}
                min={today}
                required
                id="book-date"
              />
              {getError('appointment_date') && <p className="text-xs text-red-500 mt-1">{getError('appointment_date')}</p>}
            </div>

            {/* Time Slot */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Clock size={16} className="text-pink-500" /> Select Time Slot
                {loadingSlots && <span className="spinner border-pink-500 w-4 h-4 ml-1"></span>}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = form.appointment_time === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked}
                      onClick={() => !isBooked && setForm((prev) => ({ ...prev, appointment_time: slot }))}
                      className={`py-2 px-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                        isBooked
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-200'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-pink-400 hover:text-pink-600'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {!form.appointment_time && (
                <p className="text-xs text-gray-400 mt-2">
                  {form.doctor && form.appointment_date
                    ? 'Select an available time slot above.'
                    : 'Choose a doctor and date to see available slots.'}
                </p>
              )}
              {getError('appointment_time') && <p className="text-xs text-red-500 mt-1">{getError('appointment_time')}</p>}
            </div>

            {/* Reason */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText size={16} className="text-pink-500" /> Reason for Visit
              </label>
              <textarea
                name="reason"
                className="input-field resize-none h-24"
                placeholder="Briefly describe your symptoms or reason for visit..."
                value={form.reason}
                onChange={handleChange}
                id="book-reason"
              />
            </div>

            {/* Patient ID (for admin/receptionist) */}
            {isAuthenticated && !isPatient && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Patient ID</label>
                <input
                  type="number"
                  name="patient"
                  className={`input-field ${getError('patient') ? 'border-red-400' : ''}`}
                  placeholder="Enter patient database ID"
                  value={form.patient}
                  onChange={handleChange}
                  required
                />
                {getError('patient') && <p className="text-xs text-red-500 mt-1">{getError('patient')}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !form.appointment_time}
              className="btn-primary w-full text-base py-4 justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              id="book-submit-btn"
            >
              {loading ? (
                <span className="flex items-center gap-2"><span className="spinner border-white"></span> Booking...</span>
              ) : (
                <span className="flex items-center gap-2"><CalendarDays size={18} /> Confirm Appointment</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
