import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUserInjured, 
  FaUserMd, 
  FaCalendarCheck, 
  FaPrescriptionBottleAlt,
  FaTimes
} from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { path: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/patients', icon: FaUserInjured, label: 'Patients' },
    { path: '/doctors', icon: FaUserMd, label: 'Doctors' },
    { path: '/appointments', icon: FaCalendarCheck, label: 'Appointments' },
    { path: '/prescriptions', icon: FaPrescriptionBottleAlt, label: 'Prescriptions' },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-6 border-b border-blue-700">
          <div className="flex items-center space-x-2">
            <div className="bg-white text-blue-800 rounded-lg p-2">
              <FaUserMd className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">Evalute Health</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-white hover:text-gray-200 focus:outline-none"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'bg-blue-700 text-white shadow-lg'
                          : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
          <div className="text-xs text-blue-200 text-center">
            <p>Evalute Health</p>
            <p className="mt-1">Smart Appointment System</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
