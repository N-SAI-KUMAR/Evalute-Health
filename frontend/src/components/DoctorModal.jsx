import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const DoctorModal = ({ isOpen, onClose, onSave, doctor, mode }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    experience: '',
    phone: '',
    email: '',
  });

  const specializations = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Gastroenterology', 'Oncology', 'Psychiatry', 'Radiology', 'General Medicine', 'Surgery', 'Gynecology'];

  useEffect(() => {
    if (doctor) {
      setFormData(doctor);
    } else {
      setFormData({ name: '', specialization: '', experience: '', phone: '', email: '' });
    }
  }, [doctor]);

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
          <h2 className="text-2xl font-bold text-gray-900">{mode === 'add' ? 'Add New Doctor' : mode === 'edit' ? 'Edit Doctor' : 'Doctor Details'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><FaTimes className="h-6 w-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="name" className="label">Full Name *</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} disabled={isViewMode} required className="input-field" placeholder="Enter doctor name" />
            </div>

            <div>
              <label htmlFor="specialization" className="label">Specialization *</label>
              <select id="specialization" name="specialization" value={formData.specialization} onChange={handleChange} disabled={isViewMode} required className="input-field">
                <option value="">Select specialization</option>
                {specializations.map((spec) => (<option key={spec} value={spec}>{spec}</option>))}
              </select>
            </div>

            <div>
              <label htmlFor="experience" className="label">Experience (years) *</label>
              <input type="number" id="experience" name="experience" value={formData.experience} onChange={handleChange} disabled={isViewMode} required min="0" max="50" className="input-field" placeholder="Years of experience" />
            </div>

            <div>
              <label htmlFor="phone" className="label">Phone Number *</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} disabled={isViewMode} required className="input-field" placeholder="Enter phone number" />
            </div>

            <div>
              <label htmlFor="email" className="label">Email Address *</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} disabled={isViewMode} required className="input-field" placeholder="Enter email address" />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">{isViewMode ? 'Close' : 'Cancel'}</button>
            {!isViewMode && (<button type="submit" className="btn-primary">{mode === 'add' ? 'Add Doctor' : 'Update Doctor'}</button>)}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorModal;
