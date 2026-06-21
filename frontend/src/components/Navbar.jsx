import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaBars
} from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  let user = {
    name: 'User',
    email: 'user@evalute.health'
  };

  try {
    const storedUser = localStorage.getItem('user');

    if (
      storedUser &&
      storedUser !== 'undefined' &&
      storedUser !== 'null'
    ) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error('User parse error:', error);
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const notifications = [
    { id: 1, text: 'New appointment booked', time: '5 min ago' },
    { id: 2, text: 'Patient registered successfully', time: '10 min ago' },
    { id: 3, text: 'Prescription added', time: '1 hour ago' }
  ];

  return (
    <nav className="bg-white shadow-md fixed top-0 right-0 left-0 lg:left-64 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <FaBars className="h-6 w-6" />
            </button>

            <h1 className="ml-4 lg:ml-0 text-xl font-semibold text-gray-800">
              Evalute Health
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() =>
                  setShowNotifications(!showNotifications)
                }
                className="relative p-2 text-gray-600 hover:text-gray-900"
              >
                <FaBell className="h-6 w-6" />

                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  3
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Notifications
                    </h3>
                  </div>

                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                    >
                      <p className="text-sm text-gray-800">
                        {notif.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notif.time}
                      </p>
                    </div>
                  ))}

                  <div className="px-4 py-2 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 text-gray-700"
              >
                <FaUserCircle className="h-8 w-8" />
                <span>{user.name}</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-700">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;