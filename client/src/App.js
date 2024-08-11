import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute'; // Ensure you import PrivateRoute

function App() {
  return (
    <Router>
      <div>

      <Header />
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        </Routes>
      </div>
      </div>
    </Router>
  );
}

export default App;
