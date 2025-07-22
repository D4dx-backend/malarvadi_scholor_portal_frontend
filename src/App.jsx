import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import StudentRegistration from './pages/StudentRegistration';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SimpleCertificateGenerator from './pages/SimpleCertificateGenerator';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes with header */}
        <Route path="/" element={
          <div className="min-h-screen bg-gray-50">
            <Header />
            <StudentRegistration />
          </div>
        } />
        <Route path="/register" element={
          <div className="min-h-screen bg-gray-50">
            <Header />
            <StudentRegistration />
          </div>
        } />

        {/* Admin routes without public header */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/certificate/simple" element={<SimpleCertificateGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;
