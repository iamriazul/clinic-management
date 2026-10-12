import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { doctorAPI } from '../api';
import {
  Heart, CalendarDays, Users, Stethoscope, Shield, Clock,
  Phone, Mail, MapPin, ArrowRight, Star, Activity,
  Thermometer, Eye, Brain, Bone
} from 'lucide-react';

export default function HomePage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await doctorAPI.list();
      setDoctors(res.data);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const services = [
    { icon: Stethoscope, title: 'General Checkup', desc: 'Comprehensive health examinations and preventive care.' },
    { icon: Heart, title: 'Cardiology', desc: 'Heart health monitoring and cardiovascular treatments.' },
    { icon: Eye, title: 'Ophthalmology', desc: 'Eye examinations, vision tests, and corrective procedures.' },
    { icon: Brain, title: 'Neurology', desc: 'Diagnosis and treatment of nervous system disorders.' },
    { icon: Bone, title: 'Orthopedics', desc: 'Bone, joint, and muscle care for all ages.' },
    { icon: Thermometer, title: 'Pediatrics', desc: 'Specialized healthcare for infants, children, and teens.' },
  ];

  return (
    <div className="min-h-screen" id="homepage">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden pt-16" id="hero-section">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-aqua/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-pink-300 text-sm font-medium mb-6">
                <Activity size={16} />
                Trusted Healthcare Since 2020
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Your Health,{' '}
                <span className="gradient-text">Our Priority</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">
                Experience world-class healthcare with our team of expert doctors.
                Book appointments online, manage your health records, and receive
                personalized medical care — all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/appointments/book"
                  className="btn-primary text-base gap-2"
                  id="hero-book-btn"
                >
                  <CalendarDays size={20} />
                  Book Appointment
                </Link>
                <Link
                  to="/doctors"
                  className="btn-outline border-white/30 text-white hover:bg-white hover:text-gray-900 text-base gap-2"
                  id="hero-doctors-btn"
                >
                  Our Doctors
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
                <div>
                  <p className="text-3xl font-bold text-white">50+</p>
                  <p className="text-sm text-gray-400 mt-1">Expert Doctors</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">10K+</p>
                  <p className="text-sm text-gray-400 mt-1">Happy Patients</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">24/7</p>
                  <p className="text-sm text-gray-400 mt-1">Available Care</p>
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden lg:flex justify-center animate-slide-in-right">
              <div className="relative">
                <div className="w-80 h-80 rounded-full gradient-pink-aqua opacity-20 blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative glass rounded-3xl p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Heart, label: 'Cardiology', color: 'text-pink-500' },
                      { icon: Brain, label: 'Neurology', color: 'text-purple-500' },
                      { icon: Bone, label: 'Orthopedics', color: 'text-blue-500' },
                      { icon: Eye, label: 'Eye Care', color: 'text-emerald-500' },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-2xl p-5 shadow-lg card-hover text-center"
                      >
                        <item.icon size={32} className={`${item.color} mx-auto mb-2`} />
                        <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,60 C360,100 720,0 1080,60 C1260,90 1380,80 1440,60 V100 H0 Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-20 bg-gray-50" id="doctors-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-bold text-pink-500 uppercase tracking-widest">Our Team</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
              Meet Our <span className="gradient-text">Expert Doctors</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our experienced medical professionals are dedicated to providing you with the best possible care.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner border-pink-500 w-8 h-8"></div>
            </div>
          ) : doctors.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No doctors available at the moment.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.map((doctor, index) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
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
                    <span className="text-sm text-gray-500">Consultation</span>
                    <span className="text-lg font-bold text-gray-900">${doctor.consultation_fee}</span>
                  </div>
                  <Link
                    to="/appointments/book"
                    className="mt-4 w-full btn-primary text-sm py-2.5 justify-center"
                  >
                    Book Now
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/doctors" className="btn-outline text-sm">
              View All Doctors <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white" id="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-bold text-aqua-600 uppercase tracking-widest">What We Offer</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We provide a wide range of medical services to meet your healthcare needs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-gray-50 hover:bg-white rounded-2xl p-7 border border-gray-100 hover:border-pink-200 card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-pink-100 group-hover:gradient-pink-aqua flex items-center justify-center mb-5 transition-all duration-300">
                  <service.icon size={28} className="text-pink-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Contact Section */}
      <section className="py-20 bg-gray-50" id="about-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* About */}
            <div className="animate-fade-in">
              <span className="text-sm font-bold text-pink-500 uppercase tracking-widest">About Us</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-6">
                Why Choose <span className="gradient-text">MediCare</span>?
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                MediCare Clinic has been providing exceptional healthcare services since 2020.
                Our state-of-the-art facility is equipped with modern medical technology and staffed
                by highly qualified healthcare professionals dedicated to your well-being.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Shield, text: 'Board-certified medical professionals' },
                  { icon: Clock, text: '24/7 emergency care availability' },
                  { icon: Users, text: 'Patient-centered approach' },
                  { icon: Activity, text: 'State-of-the-art medical equipment' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 rounded-xl bg-aqua-100 flex items-center justify-center flex-shrink-0">
                      <item.icon size={20} className="text-aqua-700" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-slide-in-right" id="contact-section">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <MapPin size={22} className="text-pink-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Address</h4>
                    <p className="text-gray-500 text-sm mt-1">123 Medical Center Drive, Suite 100<br />Healthcare City, HC 12345</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-aqua-100 flex items-center justify-center flex-shrink-0">
                    <Phone size={22} className="text-aqua-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-500 text-sm mt-1">(555) 123-4567</p>
                    <p className="text-gray-500 text-sm">Emergency: (555) 987-6543</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Mail size={22} className="text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-500 text-sm mt-1">info@medicare-clinic.com</p>
                    <p className="text-gray-500 text-sm">appointments@medicare-clinic.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Clock size={22} className="text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Working Hours</h4>
                    <p className="text-gray-500 text-sm mt-1">Mon - Fri: 8:00 AM - 8:00 PM</p>
                    <p className="text-gray-500 text-sm">Sat - Sun: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-pink-aqua relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Take Care of Your Health?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Book an appointment today and let our expert doctors help you on your journey to better health.
          </p>
          <Link
            to="/appointments/book"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-pink-600 bg-white hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl text-lg"
            id="cta-book-btn"
          >
            <CalendarDays size={22} />
            Book Appointment Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12" id="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl gradient-pink-aqua flex items-center justify-center">
                  <Heart size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold text-white">MediCare</span>
              </div>
              <p className="text-sm leading-relaxed">
                Providing exceptional healthcare services with compassion and expertise since 2020.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-pink-400 transition-colors">Home</Link></li>
                <li><Link to="/doctors" className="hover:text-pink-400 transition-colors">Doctors</Link></li>
                <li><Link to="/appointments/book" className="hover:text-pink-400 transition-colors">Book Appointment</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>General Checkup</li>
                <li>Cardiology</li>
                <li>Orthopedics</li>
                <li>Pediatrics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Phone size={14} /> (555) 123-4567</li>
                <li className="flex items-center gap-2"><Mail size={14} /> info@medicare-clinic.com</li>
                <li className="flex items-center gap-2"><MapPin size={14} /> Healthcare City, HC 12345</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} MediCare Clinic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
