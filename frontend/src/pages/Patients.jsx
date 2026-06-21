import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Layout from '../components/Layout';
import PatientModal from '../components/PatientModal';
import Loader from '../components/Loader';
import { patientAPI } from '../services/api';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchTerm, patients]);



const fetchPatients = async () => {
  try {
    const response = await patientAPI.getAll();

    console.log('First Patient:', response.data.patients[0]);

    const patientsData = response.data.patients || [];

    setPatients(patientsData);
    setFilteredPatients(patientsData);
  } catch (error) {
    console.error('Error fetching patients:', error);
    setPatients([]);
    setFilteredPatients([]);
  } finally {
    setLoading(false);
  }
};



  const filterPatients = () => {
    if (searchTerm === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phone.includes(searchTerm)
      );
      setFilteredPatients(filtered);
    }
  };

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setModalMode('add');
    setShowModal(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientAPI.delete(id);
        setPatients(patients.filter((p) => (p._id || p.id) !== id));
        alert('Patient deleted successfully!');
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Failed to delete patient.');
      }
    }
  };

  const handleSavePatient = async (patientData) => {
    try {
      if (modalMode === 'add') {
        const response = await patientAPI.create(patientData);
        const newPatient = response.data.data || response.data;
        setPatients([...patients, newPatient]);
        alert('Patient added successfully!');
      } else if (modalMode === 'edit') {
        const response = await patientAPI.update(selectedPatient._id || selectedPatient.id, patientData);
        const updatedPatient = response.data.data || response.data;
        setPatients(
          patients.map((p) =>
            (p._id || p.id) === (selectedPatient._id || selectedPatient.id) ? updatedPatient : p
          )
        );
        alert('Patient updated successfully!');
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving patient:', error);
      alert(error.response?.data?.message || 'Failed to save patient.');
    }
  };

  if (loading) return <Loader />;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
            <p className="mt-1 text-sm text-gray-600">Manage patient records</p>
          </div>
          <button
            onClick={handleAddPatient}
            className="mt-4 sm:mt-0 btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            <FaPlus />
            <span>Add Patient</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No patients found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Gender
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
                   {Array.isArray(filteredPatients) &&
                     filteredPatients.map((patient, index) => (
                    <tr key={patient.patient_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.age}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleViewPatient(patient)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="View"
                          >
                            <FaEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEditPatient(patient)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Edit"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeletePatient(patient.patient_id)}
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
        <PatientModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSavePatient}
          patient={selectedPatient}
          mode={modalMode}
        />
      )}
    </Layout>
  );
};

export default Patients;
