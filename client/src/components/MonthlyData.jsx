import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const MonthlyData = () => {
  const [data, setData] = useState([["Month", "Income", "Savings", "Spendings"]]); // Include headers for the chart

  useEffect(() => {
    const fetchMonthlyData = async () => {
      const token = localStorage.getItem("authToken");

      const response = await fetch("http://localhost:4000/getMonthlyData", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        
        const months = result.reduce((acc, item) => {
          const month = item.month.slice(0, 7); // Extract YYYY-MM
          if (!acc[month]) {
            acc[month] = { Income: 0, Savings: 0, Spendings: 0 };
          }
          acc[month][item.category] = parseFloat(item.total_amount);
          return acc;
        }, {});

        const chartData = Object.entries(months).map(([month, categories]) => [
          month,
          categories.Income || 0,
          categories.Savings || 0,
          categories.Spendings || 0,
        ]);

        // Add the chart headers
        setData([["Month", "Income", "Savings", "Spendings"], ...chartData]);
      }
    };

    fetchMonthlyData();
  }, []);

  const options = {
    title: "Monthly Income, Savings, and Spendings",
    chartArea: { width: "50%" },
    hAxis: {
      title: "Month",
    },
    vAxis: {
      title: "Total Amount",
      minValue: 0,
    },
    isStacked: true,
  };

  return (
    <div>
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </div>
  );
};

export default MonthlyData;
