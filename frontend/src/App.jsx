import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import Company from './pages/Company';
import Service from './pages/Service';

import EmployerDetails from './pages/EmployerDetails';
import EmployeeDetails from './pages/EmployeeDetails';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import EmployeeProfilePage from './pages/EmployeeProfilePage'; 

import UpdateProfilePic from './components/UpdateProfilePic'; 

const App = () => {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* ✅ Redirect root to /jobs */}
        <Route path="/" element={<Navigate to="/jobs" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/company" element={<Company />} />
        <Route path="/service" element={<Service />} />
        <Route path="/employee/details" element={<EmployeeDetails />} />
        <Route path="/employer/details" element={<EmployerDetails />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/dashboard" element={<EmployerDashboard />} />
        <Route path="/employee/:id" element={<EmployeeProfilePage />} />

        {/* Cropping route */}
        <Route path="/update-profilepic/:userId" element={<UpdateProfilePic />} />


      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;



