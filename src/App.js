// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import LearnMore from './pages/LearnMore';
import ContactUs from './pages/ContactUs';
import AdminLogin from './pages/AdminLogin';
import TestingLogin from './pages/TestingLogin';
import CodeAssessment from './pages/CodeAssessment';
import DeployedModelAssessment from './pages/DeployedModelAssessment';
import DatasetAssessment from './pages/DatasetAssessment';
import ScrollToTop from './components/ScrollToTop'; // Optional

function App() {
  return (
    <Router>
      <Loader />
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/testing-login" element={<TestingLogin />} />
        <Route path="/code-assessment" element={<CodeAssessment />} />
        <Route path="/deployed-model-assessment" element={<DeployedModelAssessment />} />
        <Route path="/dataset-assessment" element={<DatasetAssessment />} />
      </Routes>
    </Router>
  );
}

export default App;
