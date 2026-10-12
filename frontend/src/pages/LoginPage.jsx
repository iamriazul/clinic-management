import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, Heart, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      showToast('Login successful!', 'success');
      navigate('/dashboard');
    } catch (err) {
      const errData = err.response?.data;
      setError(errData?.non_field_errors?.[0] || errData?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" id="login-page">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative items-center justify-center p-12">
        <div className="absolute top-10 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-aqua/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="relative text-center">
          <div className="w-20 h-20 rounded-2xl gradient-pink-aqua flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Heart size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Welcome Back to <span className="gradient-text">MediCare</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-md">
            Access your dashboard to manage appointments, view records, and stay connected with your healthcare team.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl gradient-pink-aqua flex items-center justify-center">
              <Heart size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold">MediCare</span>
          </Link>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Sign In</h2>
          <p className="text-gray-500 mb-8">Enter your credentials to access your account.</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter your username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                id="login-username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base py-3.5"
              id="login-submit-btn"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="spinner border-white"></span> Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={18} /> Sign In
                </span>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-pink-500 font-semibold hover:text-pink-600">
              Register as Patient
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
