import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaTimes } from 'react-icons/fa';
import Layout from '../components/Layout';
import AppointmentModal from '../components/AppointmentModal';
import Loader from '../components/Loader';
import { appointmentAPI, patientAPI, doctorAPI } from '../services/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, statusFilter, appointments]);

  const fetchData = async () => {
  try {
    const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
      appointmentAPI.getAll(),
      patientAPI.getAll(),
      doctorAPI.getAll(),
    ]);

    console.log("Appointments:", appointmentsRes.data);
    console.log("Patients:", patientsRes.data);
    console.log("Doctors:", doctorsRes.data);

    const appointmentsData =
      appointmentsRes.data.appointments ||
      appointmentsRes.data.data ||
      appointmentsRes.data ||
      [];

    const patientsData =
      patientsRes.data.patients ||
      patientsRes.data.data ||
      patientsRes.data ||
      [];

    const doctorsData =
      doctorsRes.data.doctors ||
      doctorsRes.data.data ||
      doctorsRes.data ||
      [];

    setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    setFilteredAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    setPatients(Array.isArray(patientsData) ? patientsData : []);
    setDoctors(Array.isArray(doctorsData) ? doctorsData : []);

  } catch (error) {
    console.error("Error fetching data:", error);
    setAppointments([]);
    setFilteredAppointments([]);
    setPatients([]);
    setDoctors([]);
  } finally {
    setLoading(false);
  }
};

  const filterAppointments = () => {
    let filtered = appointments;

    if (statusFilter !== 'All') {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    if (searchTerm !== '') {
      filtered = filtered.filter(
        (apt) =>
          (apt.patientName && apt.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (apt.doctorName && apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (apt.reason && apt.reason.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleBookAppointment = () => {
    setSelectedAppointment(null);
    setModalMode('add');
    setShowModal(true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalMode('view');
    setShowModal(true);
  };

  const handleCancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const appointment = appointments.find((apt) => (apt._id || apt.id) === id);
        await appointmentAPI.update(id, { ...appointment, status: 'Cancelled' });
        setAppointments(
          appointments.map((apt) =>
            (apt._id || apt.id) === id ? { ...apt, status: 'Cancelled' } : apt
          )
        );
        alert('Appointment cancelled successfully!');
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('Failed to cancel appointment.');
      }
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentAPI.delete(id);
        setAppointments(appointments.filter((apt) => (apt._id || apt.id) !== id));
        alert('Appointment deleted successfully!');
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Failed to delete appointment.');
      }
    }
  };

  const handleSaveAppointment = async (appointmentData) => {
    try {
      const patient = patients.find((p) => (p._id || p.id) === appointmentData.patientId);
      const doctor = doctors.find((d) => (d._id || d.id) === appointmentData.doctorId);

      const dataToSave = {
        ...appointmentData,
        patientName: patient?.name,
        doctorName: doctor?.name,
      };

      if (modalMode === 'add') {
        const response = await appointmentAPI.create(dataToSave);
        const newAppointment = response.data.data || response.data;
        setAppointments([...appointments, newAppointment]);
        alert('Appointment booked successfully!');
      } else if (modalMode === 'edit') {
        const response = await appointmentAPI.update(
          selectedAppointment._id || selectedAppointment.id,
          dataToSave
        );
        const updatedAppointment = response.data.data || response.data;
        setAppointments(
          appointments.map((apt) =>
            (apt._id || apt.id) === (selectedAppointment._id || selectedAppointment.id)
              ? updatedAppointment
              : apt
          )
        );
        alert('Appointment updated successfully!');
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving appointment:', error);
      alert(error.response?.data?.message || 'Failed to save appointment.');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Confirmed: 'bg-blue-100 text-blue-800',
      Completed: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status}
      </span>
    );
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
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="mt-1 text-sm text-gray-600">Manage patient appointments</p>
          </div>
          <button
            onClick={handleBookAppointment}
            className="mt-4 sm:mt-0 btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            <FaPlus />
            <span>Book Appointment</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search appointments by patient, doctor, or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No appointments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Patient Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Doctor Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(filteredAppointments) &&
  filteredAppointments.map((appointment, index) => (
                    <tr
  key={
    appointment.appointment_id ||
    appointment._id ||
    appointment.id ||
    index
  } className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.patientName || getPatientName(appointment.patientId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.doctorName || getDoctorName(appointment.doctorId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.time || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getStatusBadge(appointment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleViewAppointment(appointment)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="View"
                          >
                            <FaEye className="h-5 w-5" />
                          </button>
                          {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
                            <>
                              <button
                                onClick={() => handleEditAppointment(appointment)}
                                className="text-green-600 hover:text-green-900 transition-colors"
                                title="Edit"
                              >
                                <FaEdit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleCancelAppointment(appointment._id || appointment.id)}
                                className="text-orange-600 hover:text-orange-900 transition-colors"
                                title="Cancel"
                              >
                                <FaTimes className="h-5 w-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteAppointment(appointment._id || appointment.id)}
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
        <AppointmentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveAppointment}
          appointment={selectedAppointment}
          mode={modalMode}
          patients={patients}
          doctors={doctors}
        />
      )}
    </Layout>
  );
};

export default Appointments;
