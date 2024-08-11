import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css'

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId"); // Remove the token from localStorage
    console.log(localStorage.getItem("userId"))
    navigate("/login"); // Redirect to login page
  };

  return (
      <>
      {localStorage.getItem("userId") && (
        <div className="header">
          <img src="logo.png" alt="" className="logo1"/>
          <button onClick={handleLogout}>Sign Out</button>
        </div>
        )}
        </>
  );
};

export default Header;
