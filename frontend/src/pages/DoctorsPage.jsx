import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { doctorAPI } from '../api';
import { Star, CalendarDays, Search } from 'lucide-react';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (search.trim()) {
      setFiltered(
        doctors.filter(
          (d) =>
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.specialization.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFiltered(doctors);
    }
  }, [search, doctors]);

  const fetchDoctors = async () => {
    try {
      const res = await doctorAPI.list();
      setDoctors(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" id="doctors-page">
      <Navbar />

      {/* Header */}
      <div className="hero-gradient pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Our <span className="gradient-text">Doctors</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Browse our team of expert medical professionals and find the right doctor for your needs.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or specialization..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:bg-white/20 focus:border-white/40 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="doctor-search"
            />
          </div>
        </div>
      </div>

      {/* Doctor Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="spinner border-pink-500 w-8 h-8"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No doctors found.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((doctor, index) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-16 h-16 rounded-2xl gradient-pink-aqua flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {doctor.name[0]}
                </div>
                <h3 className="text-lg font-bold text-gray-900">Dr. {doctor.name}</h3>
                <p className="text-sm text-pink-500 font-medium mt-1">{doctor.specialization}</p>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Fee</span>
                  <span className="text-lg font-bold text-gray-900">${doctor.consultation_fee}</span>
                </div>
                <Link
                  to="/appointments/book"
                  className="mt-4 w-full btn-primary text-sm py-2.5 justify-center"
                >
                  <CalendarDays size={16} className="mr-1" />
                  Book Appointment
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
