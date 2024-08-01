import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const Income = ({ selectedMonth, selectedYear }) => {
  const [data, setData] = useState([["Type", "Total Amount"]]); // Include headers for the chart

  useEffect(() => {
    const fetchIncomeData = async () => {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:4000/getIncomeData?month=${selectedMonth}&year=${selectedYear}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const chartData = result.map(item => [item.type, parseFloat(item.total_amount)]); // Ensure total_amount is a float

        console.log("Fetched income data:", chartData);

        // Clear previous data and append new data
        setData([["Type", "Total Amount"], ...chartData]);
      }
    };

    if (selectedMonth && selectedYear) {
      fetchIncomeData();
    }
  }, [selectedMonth, selectedYear]); // Fetch data whenever selectedMonth or selectedYear changes

  const options = {
    title: "Income Sources",
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

export default Income;
