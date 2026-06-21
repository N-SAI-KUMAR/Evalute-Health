import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaTrash, FaEye } from 'react-icons/fa';
import Layout from '../components/Layout';
import PrescriptionModal from '../components/PrescriptionModal';
import Loader from '../components/Loader';
import { prescriptionAPI, patientAPI, doctorAPI } from '../services/api';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterPrescriptions();
  }, [searchTerm, prescriptions]);

  const fetchData = async () => {
  try {
    const [prescriptionsRes, patientsRes, doctorsRes] = await Promise.all([
      prescriptionAPI.getAll(),
      patientAPI.getAll(),
      doctorAPI.getAll(),
    ]);

    const prescriptionsData =
  prescriptionsRes.data.prescriptions ||
  prescriptionsRes.data.data ||
  prescriptionsRes.data ||
  [];
  console.log("Prescriptions:", prescriptionsRes.data);
console.log("Processed:", prescriptionsData);

    const patientsData =
      patientsRes.data.patients ||
      patientsRes.data.data ||
      [];

    const doctorsData =
      doctorsRes.data.doctors ||
      doctorsRes.data.data ||
      [];

    setPrescriptions(
      Array.isArray(prescriptionsData) ? prescriptionsData : []
    );

    setFilteredPrescriptions(
      Array.isArray(prescriptionsData) ? prescriptionsData : []
    );

    setPatients(
      Array.isArray(patientsData) ? patientsData : []
    );

    setDoctors(
      Array.isArray(doctorsData) ? doctorsData : []
    );

    setLoading(false);
  } catch (error) {
    console.error("Error fetching data:", error);
    setLoading(false);
  }
};

  const filterPrescriptions = () => {
  const prescriptionList = Array.isArray(prescriptions)
    ? prescriptions
    : [];

  if (!searchTerm) {
    setFilteredPrescriptions(prescriptionList);
    return;
  }

  const filtered = prescriptionList.filter(
    (prescription) =>
      prescription?.patientName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription?.doctorName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription?.medicine
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  setFilteredPrescriptions(filtered);
};

  const handleAddPrescription = () => {
    setSelectedPrescription(null);
    setModalMode('add');
    setShowModal(true);
  };

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDeletePrescription = async (id) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await prescriptionAPI.delete(id);
        setPrescriptions(
  prescriptions.filter(
    (p) => (p.prescription_id || p._id || p.id) !== id
  )
);
        alert('Prescription deleted successfully!');
      } catch (error) {
  console.error('DELETE ERROR:', error);
  console.log(error.response);
  console.log(error.response?.data);
  alert('Failed to delete prescription.');
}
    }
  };

  const handleSavePrescription = async (prescriptionData) => {
    try {
      const patient = patients.find((p) => (p._id || p.id) === prescriptionData.patientId);
      const doctor = doctors.find((d) => (d._id || d.id) === prescriptionData.doctorId);

      const dataToSave = {
        ...prescriptionData,
        patientName: patient?.name,
        doctorName: doctor?.name,
        date: new Date().toISOString(),
      };

      const response = await prescriptionAPI.create(dataToSave);
      const newPrescription = response.data.data || response.data;
      setPrescriptions([...prescriptions, newPrescription]);
      alert('Prescription added successfully!');
      setShowModal(false);
    } catch (error) {
      console.error('Error saving prescription:', error);
      alert(error.response?.data?.message || 'Failed to save prescription.');
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find((p) => (p._id || p.id) === patientId);
    return patient?.name || 'Unknown';
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find((d) => (d._id || d.id) === doctorId);
    return doctor?.name || 'Unknown';
  };

  if (loading) return <Loader />;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
            <p className="mt-1 text-sm text-gray-600">Manage patient prescriptions</p>
          </div>
          <button
            onClick={handleAddPrescription}
            className="mt-4 sm:mt-0 btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            <FaPlus />
            <span>Add Prescription</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search prescriptions by patient, doctor, or medicine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {!Array.isArray(filteredPrescriptions) || filteredPrescriptions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No prescriptions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Medicine
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Dosage
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
  {Array.isArray(filteredPrescriptions) &&
    (filteredPrescriptions || []).map((prescription, index) => (
                    <tr
  key={`${prescription.prescription_id || prescription._id || prescription.id || index}`}
  className="hover:bg-gray-50 transition-colors"
>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prescription.patientName || getPatientName(prescription.patientId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prescription.doctorName || getDoctorName(prescription.doctorId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prescription.medicine}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {prescription.dosage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prescription.date ? new Date(prescription.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleViewPrescription(prescription)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="View"
                          >
                            <FaEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
  console.log("DELETE OBJECT:", prescription);

  handleDeletePrescription(
    prescription.prescription_id ||
    prescription._id ||
    prescription.id
  );
}}
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
        <PrescriptionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSavePrescription}
          prescription={selectedPrescription}
          mode={modalMode}
          patients={patients}
          doctors={doctors}
        />
      )}
    </Layout>
  );
};

export default Prescriptions;
