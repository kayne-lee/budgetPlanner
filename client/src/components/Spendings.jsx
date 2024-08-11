import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const Spendings = ({ selectedMonth, selectedYear }) => {
  const [data, setData] = useState([["Type", "Total Amount"]]); // Include headers for the chart

  useEffect(() => {
    const fetchSpendingsData = async () => {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`https://budgetplanner-v9zo.onrender.com/getSpendingsData?month=${selectedMonth}&year=${selectedYear}&user_id=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        const chartData = result.map(item => [item.transaction_type, parseFloat(item.total_amount)]); // Ensure total_amount is a float

        // Clear previous data and append new data
        setData([["Type", "Total Amount"], ...chartData]);
      }
    };

    if (selectedMonth && selectedYear) {
      fetchSpendingsData();
    }
  }, [selectedMonth, selectedYear]); // Fetch data whenever selectedMonth or selectedYear changes

  const options = {
    title: "Spending Sources",
  };

  return (
    <div>
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"800px"}
        height={"200px"}
      />
    </div>
  );
};

export default Spendings;
