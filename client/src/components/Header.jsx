import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css'

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove the token from localStorage
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="header">
      <div>Budget Planner</div>
      {localStorage.getItem("authToken") && (
          <button onClick={handleLogout}>Sign Out</button>
        )}
    </div>
  );
};

export default Header;
