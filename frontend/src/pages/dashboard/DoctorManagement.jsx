import { useState, useEffect } from 'react';
import { doctorAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  Plus, Pencil, Trash2, X, Save, Search, UserCog
} from 'lucide-react';

const EMPTY_FORM = {
  name: '', specialization: '', phone: '', email: '',
  consultation_fee: '', is_available: true,
};

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, doctor: null });
  const { showToast } = useToast();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await doctorAPI.list();
      setDoctors(res.data);
    } catch {
      showToast('Failed to load doctors.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingDoctor(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (doctor) => {
    setEditingDoctor(doctor);
    setForm({
      name: doctor.name,
      specialization: doctor.specialization,
      phone: doctor.phone,
      email: doctor.email,
      consultation_fee: doctor.consultation_fee,
      is_available: doctor.is_available,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setSaving(true);
    try {
      if (editingDoctor) {
        await doctorAPI.update(editingDoctor.id, form);
        showToast('Doctor updated successfully!', 'success');
      } else {
        await doctorAPI.create(form);
        showToast('Doctor created successfully!', 'success');
      }
      setShowModal(false);
      fetchDoctors();
    } catch (err) {
      const errData = err.response?.data;
      if (typeof errData === 'object') {
        setFormErrors(errData);
      } else {
        showToast('Failed to save doctor.', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (doctor) => {
    setDeleteDialog({ open: true, doctor });
  };

  const handleDelete = async () => {
    const { doctor } = deleteDialog;
    setDeleteDialog({ open: false, doctor: null });
    try {
      await doctorAPI.delete(doctor.id);
      showToast('Doctor deleted.', 'success');
      fetchDoctors();
    } catch {
      showToast('Failed to delete doctor.', 'error');
    }
  };

  const getError = (field) => {
    const err = formErrors[field];
    return Array.isArray(err) ? err[0] : err;
  };

  return (
    <div className="space-y-6" id="doctor-management">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Doctor Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your clinic's medical professionals</p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary text-sm py-2.5 gap-2"
          id="add-doctor-btn"
        >
          <Plus size={18} /> Add Doctor
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search doctors..."
          className="input-field pl-11"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="doctor-search"
        />
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
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Phone</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No doctors found.
                  </td>
                </tr>
              ) : (
                filtered.map((doctor) => (
                  <tr key={doctor.id} className="animate-fade-in">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl gradient-pink-aqua flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {doctor.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Dr. {doctor.name}</p>
                          <p className="text-xs text-gray-500">{doctor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-gray-600">{doctor.specialization}</td>
                    <td className="text-gray-600">{doctor.phone || '—'}</td>
                    <td className="font-semibold text-gray-900">${doctor.consultation_fee}</td>
                    <td>
                      <span className={`badge ${doctor.is_available ? 'badge-confirmed' : 'badge-cancelled'}`}>
                        {doctor.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(doctor)}
                          className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                          title="Edit"
                          id={`edit-doctor-${doctor.id}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => confirmDelete(doctor)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                          id={`delete-doctor-${doctor.id}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="doctor-modal">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-7 animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl gradient-pink-aqua flex items-center justify-center">
                <UserCog size={22} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input
                  name="name"
                  className={`input-field ${getError('name') ? 'border-red-400' : ''}`}
                  placeholder="Doctor's full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  id="doctor-form-name"
                />
                {getError('name') && <p className="text-xs text-red-500 mt-1">{getError('name')}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specialization *</label>
                <input
                  name="specialization"
                  className={`input-field ${getError('specialization') ? 'border-red-400' : ''}`}
                  placeholder="e.g. Cardiology, Orthopedics"
                  value={form.specialization}
                  onChange={handleChange}
                  required
                  id="doctor-form-spec"
                />
                {getError('specialization') && <p className="text-xs text-red-500 mt-1">{getError('specialization')}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                  <input
                    name="phone"
                    className="input-field"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={handleChange}
                    id="doctor-form-phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="input-field"
                    placeholder="Email address"
                    value={form.email}
                    onChange={handleChange}
                    id="doctor-form-email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Consultation Fee ($) *</label>
                <input
                  name="consultation_fee"
                  type="number"
                  step="0.01"
                  min="0"
                  className={`input-field ${getError('consultation_fee') ? 'border-red-400' : ''}`}
                  placeholder="0.00"
                  value={form.consultation_fee}
                  onChange={handleChange}
                  required
                  id="doctor-form-fee"
                />
                {getError('consultation_fee') && <p className="text-xs text-red-500 mt-1">{getError('consultation_fee')}</p>}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_available"
                  id="doctor-form-available"
                  checked={form.is_available}
                  onChange={handleChange}
                  className="w-4 h-4 accent-pink-500"
                />
                <label htmlFor="doctor-form-available" className="text-sm font-medium text-gray-700">
                  Available for appointments
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary text-sm py-2.5 px-6"
                  id="doctor-form-submit"
                >
                  {saving ? (
                    <span className="flex items-center gap-2"><span className="spinner border-white w-4 h-4"></span> Saving...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Save size={16} /> {editingDoctor ? 'Update' : 'Create'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.open}
        title="Delete Doctor"
        message={`Are you sure you want to delete Dr. ${deleteDialog.doctor?.name}? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, doctor: null })}
      />
    </div>
  );
}
