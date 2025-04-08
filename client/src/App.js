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
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Profile from './pages/Profile';
import TesterDashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import FrameworkVulnerabilityAssessment from './pages/FrameworkVulnerabilityAssessment';
import AdversarialAttackSimulation from './pages/AdversarialAttackSimulation';
import CodeAssessment from './pages/CodeAssessment';
import AssessmentDashboard from './pages/AssessmentDashboard';
import ComplianceAssessment from './pages/ComplianceAssessment';

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
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/dashboard" element={<TesterDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/framework-assessment" element={<FrameworkVulnerabilityAssessment />} />
        <Route path="/adversarial-attack-simulation" element={<AdversarialAttackSimulation />} />
        <Route path="/Vulncode-assessment" element={<CodeAssessment />} />
        <Route path="/assessment-dashboard" element={<AssessmentDashboard />} />
        <Route path="/compliance-assessment" element={<ComplianceAssessment />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
