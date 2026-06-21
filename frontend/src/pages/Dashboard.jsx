import React, { useState, useEffect } from 'react';
import { FaUserInjured, FaUserMd, FaCalendarCheck, FaPrescriptionBottleAlt, FaArrowUp } from 'react-icons/fa';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import { patientAPI, doctorAPI, appointmentAPI, prescriptionAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalPrescriptions: 0,
  });
  const [loading, setLoading] = useState(true);

  const [weeklyData, setWeeklyData] = useState([]);

  const [appointmentStatusData, setAppointmentStatusData] = useState([]);

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  try {
    const [patientsRes, doctorsRes, appointmentsRes, prescriptionsRes] =
      await Promise.all([
        patientAPI.getAll(),
        doctorAPI.getAll(),
        appointmentAPI.getAll(),
        prescriptionAPI.getAll(),
      ]);

    console.log("Patients Response:", patientsRes.data);
    console.log("Doctors Response:", doctorsRes.data);
    console.log("Appointments Response:", appointmentsRes.data);
    console.log("Prescriptions Response:", prescriptionsRes.data);

    const patientsData =
      patientsRes.data.patients ||
      patientsRes.data.data ||
      [];

    const doctorsData =
      doctorsRes.data.doctors ||
      doctorsRes.data.data ||
      [];

    const appointmentsData =
      appointmentsRes.data.appointments ||
      appointmentsRes.data.data ||
      [];
    const pending = appointmentsData.filter(
  (a) => a.status === "Pending"
).length;

const approved = appointmentsData.filter(
  (a) => a.status === "Approved"
).length;

const booked = appointmentsData.filter(
  (a) => a.status === "Booked"
).length;

setAppointmentStatusData([
  { name: "Pending", value: pending, color: "#fbbf24" },
  { name: "Approved", value: approved, color: "#10b981" },
  { name: "Booked", value: booked, color: "#3b82f6" },
]);  

    const prescriptionsData =
      prescriptionsRes.data.prescriptions ||
      prescriptionsRes.data.data ||
      [];

    setStats({
  totalPatients: patientsData.length,
  totalDoctors: doctorsData.length,
  totalAppointments: appointmentsData.length,
  totalPrescriptions: prescriptionsData.length,
});

setWeeklyData([
  {
    day: "Current",
    patients: patientsData.length,
    appointments: appointmentsData.length,
  },
]);
    const activities = [];

patientsData.slice(-2).forEach((patient, index) => {
  activities.push({
    id: `p${index}`,
    action: "New patient registered",
    name: patient.name,
    time: "Recently",
    type: "patient",
  });
});

doctorsData.slice(-2).forEach((doctor, index) => {
  activities.push({
    id: `d${index}`,
    action: "New doctor added",
    name: doctor.name,
    time: "Recently",
    type: "doctor",
  });
});

appointmentsData.slice(-2).forEach((appointment, index) => {
  activities.push({
    id: `a${index}`,
    action: "Appointment booked",
    name: appointment.patientName || "Patient",
    time: "Recently",
    type: "appointment",
  });
});

prescriptionsData.slice(-2).forEach((prescription, index) => {
  activities.push({
    id: `pr${index}`,
    action: "Prescription added",
    name: prescription.patientName || "Patient",
    time: "Recently",
    type: "prescription",
  });
});

setRecentActivities(activities.reverse());

    setLoading(false);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    setLoading(false);
  }
};

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-4xl font-bold text-gray-900">{loading ? '...' : value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-sm text-green-600">
              <FaArrowUp className="mr-1" />
              <span>{trend}% from last month</span>
            </div>
          )}
        </div>
        <div className={`${color} text-white rounded-full p-4 shadow-lg`}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Welcome to Evalute Health</h1>
          <p className="text-blue-100 text-lg">Smart Hospital Appointment Management - Here's what's happening today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Patients" value={stats.totalPatients} icon={FaUserInjured} color="bg-blue-500" />
<StatCard title="Total Doctors" value={stats.totalDoctors} icon={FaUserMd} color="bg-green-500" />
<StatCard title="Total Appointments" value={stats.totalAppointments} icon={FaCalendarCheck} color="bg-purple-500" />
<StatCard title="Total Prescriptions" value={stats.totalPrescriptions} icon={FaPrescriptionBottleAlt} color="bg-orange-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Patients Analytics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={3} name="Patients" />
                <Line type="monotone" dataKey="appointments" stroke="#10b981" strokeWidth={3} name="Appointments" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointment Statistics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-full ${activity.type === 'patient' ? 'bg-blue-100 text-blue-600' : activity.type === 'doctor' ? 'bg-green-100 text-green-600' : activity.type === 'appointment' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                    {activity.type === 'patient' && <FaUserInjured />}
                    {activity.type === 'doctor' && <FaUserMd />}
                    {activity.type === 'appointment' && <FaCalendarCheck />}
                    {activity.type === 'prescription' && <FaPrescriptionBottleAlt />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
  <h2 className="text-2xl font-bold text-gray-800 mb-4">
    Today's Summary
  </h2>

  <div className="space-y-4">

    <div className="border-l-4 border-blue-500 pl-4 py-2">
      <p className="text-3xl font-bold text-gray-900">
        {stats.totalPatients}
      </p>
      <p className="text-sm text-gray-600">Patients</p>
    </div>

    <div className="border-l-4 border-green-500 pl-4 py-2">
      <p className="text-3xl font-bold text-gray-900">
        {stats.totalAppointments}
      </p>
      <p className="text-sm text-gray-600">Appointments</p>
    </div>

    <div className="border-l-4 border-purple-500 pl-4 py-2">
      <p className="text-3xl font-bold text-gray-900">
        {stats.totalDoctors}
      </p>
      <p className="text-sm text-gray-600">Doctors</p>
    </div>

    <div className="border-l-4 border-orange-500 pl-4 py-2">
      <p className="text-3xl font-bold text-gray-900">
        {stats.totalPrescriptions}
      </p>
      <p className="text-sm text-gray-600">Prescriptions</p>
    </div>

  </div>
</div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
