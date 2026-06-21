import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const PrescriptionModal = ({ isOpen, onClose, onSave, prescription, mode, patients, doctors }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    medicine: '',
    dosage: '',
    notes: '',
  });

  useEffect(() => {
    if (prescription) {
      setFormData(prescription);
    } else {
      setFormData({ patientId: '', doctorId: '', medicine: '', dosage: '', notes: '' });
    }
  }, [prescription]);

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
          <h2 className="text-2xl font-bold text-gray-900">{mode === 'add' ? 'Add New Prescription' : 'Prescription Details'}</h2>
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
                {doctors.map((doctor) => (<option key={doctor._id || doctor.id} value={doctor._id || doctor.id}>{doctor.name}</option>))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="medicine" className="label">Medicine *</label>
              <input type="text" id="medicine" name="medicine" value={formData.medicine} onChange={handleChange} disabled={isViewMode} required className="input-field" placeholder="Enter medicine name and strength (e.g., Aspirin 100mg)" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="dosage" className="label">Dosage *</label>
              <input type="text" id="dosage" name="dosage" value={formData.dosage} onChange={handleChange} disabled={isViewMode} required className="input-field" placeholder="Enter dosage (e.g., 1 tablet twice daily)" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="notes" className="label">Additional Notes</label>
              <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} disabled={isViewMode} rows="3" className="input-field" placeholder="Enter any additional instructions or notes"></textarea>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">{isViewMode ? 'Close' : 'Cancel'}</button>
            {!isViewMode && (<button type="submit" className="btn-primary">Add Prescription</button>)}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionModal;
