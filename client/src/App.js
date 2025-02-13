// client/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import LearnMore from './pages/LearnMore';
import Contact from './pages/Contact';
import Signup from './pages/Signup';
import TesterLogin from './pages/TesterLogin';
import AdminLogin from './pages/AdminLogin';
import TesterDashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import CodeAssessment from './pages/CodeAssessment';
import DeployedModelAssessment from './pages/DeployedModelAssessment';
import DatasetAssessment from './pages/DatasetAssessment';
import AssessmentDashboard from './pages/AssessmentDashboard';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tester-login" element={<TesterLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<TesterDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/code-assessment" element={<CodeAssessment />} />
        <Route path="/deployed-assessment" element={<DeployedModelAssessment />} />
        <Route path="/dataset-assessment" element={<DatasetAssessment />} />
        <Route path="/assessment-dashboard" element={<AssessmentDashboard />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
