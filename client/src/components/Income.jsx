import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const Income = () => {
  const [data, setData] = useState([["Type", "Total Amount"]]); // Include headers for the chart

  useEffect(() => {
    const fetchIncomeData = async () => {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:4000/getIncomeData", {
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

    fetchIncomeData();
  }, []);

  const options = {
    title: "Income Sources",
  };

  return (
    <div>
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"300px"}
        height={"200px"}
      />
    </div>
  );
};

export default Income;
