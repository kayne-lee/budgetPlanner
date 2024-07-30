import React from 'react';

const Dashboard = () => {
  const username = localStorage.getItem("username"); // Assuming you stored the username during login

  return (
    <div>
      <h1>Hello, {username ? username : "User"}!</h1>
      {/* Other dashboard content goes here */}
    </div>
  );
};

export default Dashboard;
