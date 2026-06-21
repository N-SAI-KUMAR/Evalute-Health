import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const AppointmentModal = ({ isOpen, onClose, onSave, appointment, mode, patients, doctors }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    status: 'Pending',
  });

  useEffect(() => {
    if (appointment) {
      setFormData(appointment);
    } else {
      setFormData({ patientId: '', doctorId: '', date: '', time: '', reason: '', status: 'Pending' });
    }
  }, [appointment]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{mode === 'add' ? 'Book New Appointment' : mode === 'edit' ? 'Update Appointment' : 'Appointment Details'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><FaTimes className="h-6 w-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="patientId" className="label">Patient *</label>
              <select id="patientId" name="patientId" value={formData.patientId} onChange={handleChange} disabled={isViewMode} required className="input-field">
                <option value="">Select patient</option>
                {patients.map((patient) => (<option key={patient._id || patient.id} value={patient._id || patient.id}>{patient.name}</option>))}
              </select>
            </div>

            <div>
              <label htmlFor="doctorId" className="label">Doctor *</label>
              <select id="doctorId" name="doctorId" value={formData.doctorId} onChange={handleChange} disabled={isViewMode} required className="input-field">
                <option value="">Select doctor</option>
                {doctors.map((doctor) => (<option key={doctor._id || doctor.id} value={doctor._id || doctor.id}>{doctor.name} - {doctor.specialization}</option>))}
              </select>
            </div>

            <div>
              <label htmlFor="date" className="label">Date *</label>
              <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} disabled={isViewMode} required min={new Date().toISOString().split('T')[0]} className="input-field" />
            </div>

            <div>
              <label htmlFor="time" className="label">Time *</label>
              <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} disabled={isViewMode} required className="input-field" />
            </div>

            {(mode === 'edit' || mode === 'view') && (
              <div>
                <label htmlFor="status" className="label">Status *</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} disabled={isViewMode} required className="input-field">
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            )}

            <div className={mode === 'add' ? 'md:col-span-2' : ''}>
              <label htmlFor="reason" className="label">Reason for Visit *</label>
              <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} disabled={isViewMode} required rows="3" className="input-field" placeholder="Enter reason for appointment"></textarea>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">{isViewMode ? 'Close' : 'Cancel'}</button>
            {!isViewMode && (<button type="submit" className="btn-primary">{mode === 'add' ? 'Book Appointment' : 'Update Appointment'}</button>)}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
