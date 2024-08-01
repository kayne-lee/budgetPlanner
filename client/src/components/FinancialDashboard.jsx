import React, { useEffect, useState } from 'react';

const FinancialDashboard = ({ selectedMonth, selectedYear }) => {
  const [incomeData, setIncomeData] = useState([]);
  const [spendingsData, setSpendingsData] = useState([]);
  const [savingsData, setSavingsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');

      const incomeResponse = await fetch(
        `http://localhost:4000/getIncomeData?month=${selectedMonth}&year=${selectedYear}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const spendingsResponse = await fetch(
        `http://localhost:4000/getSpendingsData?month=${selectedMonth}&year=${selectedYear}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const savingsResponse = await fetch(
        `http://localhost:4000/getSavingsData?month=${selectedMonth}&year=${selectedYear}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (incomeResponse.ok) {
        const incomeResult = await incomeResponse.json();
        setIncomeData(incomeResult);
      }

      if (spendingsResponse.ok) {
        const spendingsResult = await spendingsResponse.json();
        setSpendingsData(spendingsResult);
      }

      if (savingsResponse.ok) {
        const savingsResult = await savingsResponse.json();
        setSavingsData(savingsResult);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  const calculateTotalAndPercentage = (data) => {
    const totalAmount = data.reduce((acc, item) => acc + parseFloat(item.total_amount), 0);
    const totalTransactions = data.length;

    return {
      totalAmount,
      totalTransactions,
      dataWithPercentage: data.map(item => ({
        ...item,
        percentage: ((parseFloat(item.total_amount) / totalAmount) * 100).toFixed(2),
      })),
    };
  };

  const incomeTotals = calculateTotalAndPercentage(incomeData);
  const spendingsTotals = calculateTotalAndPercentage(spendingsData);
  const savingsTotals = calculateTotalAndPercentage(savingsData);

  return (
    <div>
      <h2>Financial Dashboard</h2>
      
      <h3>Income</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Total Amount</th>
            <th>Total Transactions</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {incomeTotals.dataWithPercentage.map((item, index) => (
            <tr key={index}>
              <td>{item.type}</td>
              <td>{parseFloat(item.total_amount).toFixed(2)}</td>
              <td>{1}</td> {/* Assuming each type has one transaction for simplicity */}
              <td>{item.percentage} %</td>
            </tr>
          ))}
          <tr>
            <td><strong>Total</strong></td>
            <td>{parseFloat(incomeTotals.totalAmount).toFixed(2)}</td>
            <td>{incomeTotals.totalTransactions}</td>
            <td>100.00 %</td>
          </tr>
        </tbody>
      </table>

      <h3>Spendings</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Total Amount</th>
            <th>Total Transactions</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {spendingsTotals.dataWithPercentage.map((item, index) => (
            <tr key={index}>
              <td>{item.type}</td>
              <td>{parseFloat(item.total_amount).toFixed(2)}</td>
              <td>{1}</td>
              <td>{item.percentage} %</td>
            </tr>
          ))}
          <tr>
            <td><strong>Total</strong></td>
            <td>{parseFloat(spendingsTotals.totalAmount).toFixed(2)}</td>
            <td>{spendingsTotals.totalTransactions}</td>
            <td>100.00 %</td>
          </tr>
        </tbody>
      </table>

      <h3>Savings</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Total Amount</th>
            <th>Total Transactions</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {savingsTotals.dataWithPercentage.map((item, index) => (
            <tr key={index}>
              <td>{item.type}</td>
              <td>{parseFloat(item.total_amount).toFixed(2)}</td>
              <td>{1}</td>
              <td>{item.percentage} %</td>
            </tr>
          ))}
          <tr>
            <td><strong>Total</strong></td>
            <td>{parseFloat(savingsTotals.totalAmount).toFixed(2)}</td>
            <td>{savingsTotals.totalTransactions}</td>
            <td>100.00 %</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinancialDashboard;
