import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserPlus, Heart, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '',
    phone: '', password: '', password_confirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await register(form);
      showToast('Registration successful! Welcome to MediCare.', 'success');
      navigate('/dashboard');
    } catch (err) {
      const errData = err.response?.data;
      if (typeof errData === 'object') {
        setErrors(errData);
      } else {
        setErrors({ non_field_errors: ['Registration failed. Please try again.'] });
      }
    } finally {
      setLoading(false);
    }
  };

  const getError = (field) => {
    const err = errors[field];
    return Array.isArray(err) ? err[0] : err;
  };

  return (
    <div className="min-h-screen flex" id="register-page">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative items-center justify-center p-12">
        <div className="absolute top-10 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-aqua/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="relative text-center">
          <div className="w-20 h-20 rounded-2xl gradient-pink-aqua flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Heart size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Join <span className="gradient-text">MediCare</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-md">
            Create your patient account to book appointments, access your health records, and manage your healthcare journey.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl gradient-pink-aqua flex items-center justify-center">
              <Heart size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold">MediCare</span>
          </Link>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500 mb-8">Register as a patient to get started.</p>

          {errors.non_field_errors && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-fade-in">
              {errors.non_field_errors[0]}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  className={`input-field ${getError('first_name') ? 'border-red-400' : ''}`}
                  placeholder="First name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
                {getError('first_name') && <p className="text-xs text-red-500 mt-1">{getError('first_name')}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  className={`input-field ${getError('last_name') ? 'border-red-400' : ''}`}
                  placeholder="Last name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                />
                {getError('last_name') && <p className="text-xs text-red-500 mt-1">{getError('last_name')}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
              <input
                type="text"
                name="username"
                className={`input-field ${getError('username') ? 'border-red-400' : ''}`}
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                required
                id="register-username"
              />
              {getError('username') && <p className="text-xs text-red-500 mt-1">{getError('username')}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                className={`input-field ${getError('email') ? 'border-red-400' : ''}`}
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                required
                id="register-email"
              />
              {getError('email') && <p className="text-xs text-red-500 mt-1">{getError('email')}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
              <input
                type="tel"
                name="phone"
                className="input-field"
                placeholder="Your phone number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`input-field pr-12 ${getError('password') ? 'border-red-400' : ''}`}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  id="register-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {getError('password') && <p className="text-xs text-red-500 mt-1">{getError('password')}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <input
                type="password"
                name="password_confirm"
                className={`input-field ${getError('password_confirm') ? 'border-red-400' : ''}`}
                placeholder="Confirm your password"
                value={form.password_confirm}
                onChange={handleChange}
                required
                id="register-password-confirm"
              />
              {getError('password_confirm') && <p className="text-xs text-red-500 mt-1">{getError('password_confirm')}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base py-3.5 mt-2"
              id="register-submit-btn"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="spinner border-white"></span> Creating Account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus size={18} /> Create Account
                </span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-500 font-semibold hover:text-pink-600">
              Sign In
            </Link>
          </p>

          <Link to="/" className="block mt-4 text-center text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
