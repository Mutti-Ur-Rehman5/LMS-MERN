import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

function StudentDashboard() {
  return <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">Student Dashboard</div>;
}

function TeacherDashboard() {
  return <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">Teacher Dashboard</div>;
}

function AdminDashboard() {
  return <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">Admin Dashboard</div>;
}

export default function App() {
  const getRole = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role || null;
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/student" element={getRole() === 'student' ? <StudentDashboard /> : <Navigate to="/login" />} />
      <Route path="/teacher" element={getRole() === 'teacher' ? <TeacherDashboard /> : <Navigate to="/login" />} />
      <Route path="/admin" element={getRole() === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
}