import { useState, useEffect } from 'react';
import { patientAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  Plus, Pencil, X, Save, Search, User
} from 'lucide-react';

const EMPTY_FORM = {
  name: '', date_of_birth: '', gender: '', phone: '',
  email: '', address: '', blood_group: '',
};

export default function PatientManagement() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const { isAdmin, isReceptionist } = useAuth();

  const canCreate = isAdmin || isReceptionist;

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPatients = async (q = '') => {
    setLoading(true);
    try {
      const res = await patientAPI.list(q);
      setPatients(res.data);
    } catch {
      showToast('Failed to load patients.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingPatient(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (patient) => {
    setEditingPatient(patient);
    setForm({
      name: patient.name,
      date_of_birth: patient.date_of_birth || '',
      gender: patient.gender || '',
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
      blood_group: patient.blood_group || '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setSaving(true);
    try {
      if (editingPatient) {
        await patientAPI.update(editingPatient.id, form);
        showToast('Patient updated successfully!', 'success');
      } else {
        await patientAPI.create(form);
        showToast('Patient registered successfully!', 'success');
      }
      setShowModal(false);
      fetchPatients(search);
    } catch (err) {
      const errData = err.response?.data;
      if (typeof errData === 'object') {
        setFormErrors(errData);
      } else {
        showToast('Failed to save patient.', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const getError = (field) => {
    const err = formErrors[field];
    return Array.isArray(err) ? err[0] : err;
  };

  return (
    <div className="space-y-6" id="patient-management">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Patient Management</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage patient records</p>
        </div>
        {canCreate && (
          <button
            onClick={openAdd}
            className="btn-primary text-sm py-2.5 gap-2"
            id="add-patient-btn"
          >
            <Plus size={18} /> Register Patient
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, ID or phone..."
          className="input-field pl-11"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="patient-search"
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
                <th>Patient</th>
                <th>Patient ID</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Registered</th>
                {canCreate && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={canCreate ? 6 : 5} className="text-center py-12 text-gray-400">
                    No patients found.
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id} className="animate-fade-in">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm flex-shrink-0">
                          {patient.name[0]}
                        </div>
                        <p className="font-semibold text-gray-900">{patient.name}</p>
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-pink-50 text-pink-700 text-xs font-semibold">
                        {patient.patient_id}
                      </span>
                    </td>
                    <td className="capitalize text-gray-600">{patient.gender || '—'}</td>
                    <td className="text-gray-600">{patient.phone || '—'}</td>
                    <td className="text-gray-500 text-sm">
                      {new Date(patient.created_at).toLocaleDateString()}
                    </td>
                    {canCreate && (
                      <td>
                        <button
                          onClick={() => openEdit(patient)}
                          className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                          title="Edit"
                          id={`edit-patient-${patient.id}`}
                        >
                          <Pencil size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="patient-modal">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-7 animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center">
                <User size={22} className="text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {editingPatient ? 'Edit Patient' : 'Register New Patient'}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input
                  name="name"
                  className={`input-field ${getError('name') ? 'border-red-400' : ''}`}
                  placeholder="Patient's full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  id="patient-form-name"
                />
                {getError('name') && <p className="text-xs text-red-500 mt-1">{getError('name')}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of Birth</label>
                  <input
                    name="date_of_birth"
                    type="date"
                    className="input-field"
                    value={form.date_of_birth}
                    onChange={handleChange}
                    id="patient-form-dob"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
                  <select
                    name="gender"
                    className="input-field"
                    value={form.gender}
                    onChange={handleChange}
                    id="patient-form-gender"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
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
                    id="patient-form-phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Blood Group</label>
                  <select
                    name="blood_group"
                    className="input-field"
                    value={form.blood_group}
                    onChange={handleChange}
                    id="patient-form-blood"
                  >
                    <option value="">Select</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
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
                  id="patient-form-email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
                <textarea
                  name="address"
                  className="input-field resize-none h-20"
                  placeholder="Home address"
                  value={form.address}
                  onChange={handleChange}
                  id="patient-form-address"
                />
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
                  id="patient-form-submit"
                >
                  {saving ? (
                    <span className="flex items-center gap-2"><span className="spinner border-white w-4 h-4"></span> Saving...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Save size={16} /> {editingPatient ? 'Update' : 'Register'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
