import React from 'react';
import AddTransactionForm from './AddTrans';
import Income from './Income';
import Savings from './Savings';
import Spendings from './Spendings';
import "../styles/dashboard.css"
import MonthlyData from './MonthlyData';

const Dashboard = () => {
  const username = localStorage.getItem("username"); // Assuming you stored the username during login

  return (
    <div>
      <AddTransactionForm />
      <div className="graph">
        <Income />
        <Savings />
        <Spendings />
        <MonthlyData />
      </div>
    </div>
  );
};

export default Dashboard;
