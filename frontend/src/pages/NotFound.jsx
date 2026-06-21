import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 text-red-600 rounded-full p-6 shadow-lg">
              <FaExclamationTriangle className="h-16 w-16" />
            </div>
          </div>
          <h1 className="text-9xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 text-lg mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FaHome className="h-5 w-5" />
            <span className="font-semibold">Go to Dashboard</span>
          </Link>

          <div className="flex justify-center space-x-4 pt-4">
            <Link
              to="/patients"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Patients
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              to="/doctors"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Doctors
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              to="/appointments"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Appointments
            </Link>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>© 2026 Evalute Health - Smart Hospital Appointment Management</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
