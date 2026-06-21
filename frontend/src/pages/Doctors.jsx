import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Layout from '../components/Layout';
import DoctorModal from '../components/DoctorModal';
import Loader from '../components/Loader';
import { doctorAPI } from '../services/api';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, doctors]);
  const fetchDoctors = async () => {
  try {
    const response = await doctorAPI.getAll();

    console.log(response.data);
    console.log('Doctors API Response:', response.data);
    console.log('First Doctor:', response.data.doctors?.[0]);

    const doctorsData = response.data.doctors || [];

    setDoctors(doctorsData);
    setFilteredDoctors(doctorsData);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    setDoctors([]);
    setFilteredDoctors([]);
  } finally {
    setLoading(false);
  }
};

  const filterDoctors = () => {
    if (searchTerm === '') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  };

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setModalMode('add');
    setShowModal(true);
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await doctorAPI.delete(id);
        setDoctors(doctors.filter((d) => (d._id || d.id) !== id));
        alert('Doctor deleted successfully!');
      } catch (error) {
        console.error('Error deleting doctor:', error);
        alert('Failed to delete doctor.');
      }
    }
  };

  const handleSaveDoctor = async (doctorData) => {
    try {
      if (modalMode === 'add') {
        const response = await doctorAPI.create(doctorData);
        const newDoctor = response.data.data || response.data;
        setDoctors([...doctors, newDoctor]);
        alert('Doctor added successfully!');
      } else if (modalMode === 'edit') {
        const response = await doctorAPI.update(selectedDoctor._id || selectedDoctor.id, doctorData);
        const updatedDoctor = response.data.data || response.data;
        setDoctors(
          doctors.map((d) =>
            (d._id || d.id) === (selectedDoctor._id || selectedDoctor.id) ? updatedDoctor : d
          )
        );
        alert('Doctor updated successfully!');
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving doctor:', error);
      alert(error.response?.data?.message || 'Failed to save doctor.');
    }
  };

  if (loading) return <Loader />;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
            <p className="mt-1 text-sm text-gray-600">Manage doctor records</p>
          </div>
          <button
            onClick={handleAddDoctor}
            className="mt-4 sm:mt-0 btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            <FaPlus />
            <span>Add Doctor</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search doctors by name, specialization, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No doctors found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Specialization
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(filteredDoctors) &&
                   filteredDoctors.map((doctor, index) => (
                    <tr
  key={doctor.doctor_id || doctor._id || doctor.id || index}
  className="hover:bg-gray-50 transition-colors"
>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doctor.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {doctor.specialization}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doctor.experience} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doctor.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doctor.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleViewDoctor(doctor)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="View"
                          >
                            <FaEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEditDoctor(doctor)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Edit"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteDoctor(doctor._id || doctor.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <DoctorModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveDoctor}
          doctor={selectedDoctor}
          mode={modalMode}
        />
      )}
    </Layout>
  );
};

export default Doctors;
