import React, { useState } from 'react';
import AddTransactionForm from './AddTrans';
import Income from './Income';
import Savings from './Savings';
import Spendings from './Spendings';
import "../styles/dashboard.css"
import FinancialDashboard from './FinancialDashboard';

const Dashboard = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page refresh on form submission
  };

  return (
    <div className="dashboard">
      <AddTransactionForm />
      <form onSubmit={handleSubmit} className="select">
        <select value={month} onChange={handleMonthChange}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <select value={year} onChange={handleYearChange}>
          {/* You can customize the year range */}
          {Array.from({ length: 5 }, (_, i) => (
            <option key={i} value={year - i}>
              {year - i}
            </option>
          ))}
        </select>
        <button type="submit" className="button">Submit</button>
      </form>
      <div className="data">
        <div className="graph">
          <Income selectedMonth={month} selectedYear={year} />
          <Savings selectedMonth={month} selectedYear={year}/>
          <Spendings selectedMonth={month} selectedYear={year}/>
        </div>
      <FinancialDashboard selectedMonth={month} selectedYear={year}/>
      </div>
    </div>
  );
};

export default Dashboard;
