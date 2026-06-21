import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaHospital, FaUserTag } from 'react-icons/fa';
import { authAPI } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Patient',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;
      const response = await authAPI.register(dataToSend);
      
      if (response.data.success || response.status === 201) {
        alert('Registration successful! Please login.');
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 text-white rounded-full p-4 shadow-lg">
              <FaHospital className="h-12 w-12" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Join Evalute Health</h2>
          <p className="text-gray-600">Smart Hospital Appointment Management System</p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="label">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="input-field pl-10" placeholder="Enter your full name" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="label">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="input-field pl-10" placeholder="Enter your email" />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="label">Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserTag className="h-5 w-5 text-gray-400" />
                </div>
                <select id="role" name="role" value={formData.role} onChange={handleChange} required className="input-field pl-10">
  <option value="Patient">Patient</option>
  <option value="Doctor">Doctor</option>
</select>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="input-field pl-10" placeholder="Create a password" />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="input-field pl-10" placeholder="Confirm your password" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© 2026 Evalute Health. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
