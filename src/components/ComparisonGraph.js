import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './ComparisonGraph.css';

// Register the required components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ComparisonGraph({ calculatedData }) {
  if (!calculatedData) {
    return null;
  }

  const { existingLoan, proposedLoan } = calculatedData;

  // Generate data points for the graph based on calculated data
  const labels = Array.from({ length: 360 }, (_, i) => i + 1);
  const existingLoanCosts = labels.map(
    (month) => existingLoan.totalMonthlyPayment * month
  );
  const proposedLoanCosts = labels.map(
    (month) => proposedLoan.totalMonthlyPayment * month
  );

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Existing Loan Cumulative Cost',
        data: existingLoanCosts,
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false,
      },
      {
        label: 'Proposed Loan Cumulative Cost',
        data: proposedLoanCosts,
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: false,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cumulative Cost ($)',
        },
      },
    },
  };

  return (
    <div className="graph-container">
      <h3>Cumulative Costs Over Time</h3>
      <Line data={data} options={options} />
    </div>
  );
}

export default ComparisonGraph;
