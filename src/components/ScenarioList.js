// src/components/ScenarioList.js
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from '@mui/material';

function ScenarioList({ scenarios }) {
  return (
    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Added Scenarios
      </Typography>
      {scenarios.length === 0 ? (
        <Typography variant="body1">No scenarios added yet.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Scenario Name</TableCell>
              <TableCell>Loan Amount</TableCell>
              <TableCell>Interest Rate</TableCell>
              <TableCell>Loan Term</TableCell>
              <TableCell>Monthly Payment (P&I)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scenarios.map((scenario, index) => {
              // Calculate Monthly Payment (P&I) for each scenario
              const monthlyPayment = calculateMonthlyPayment(
                parseFloat(scenario.totalProposedLoanAmount),
                parseFloat(scenario.newInterestRate),
                parseInt(scenario.loanTerm)
              ).toFixed(2);

              return (
                <TableRow key={index}>
                  <TableCell>{scenario.scenarioName || `Scenario ${index + 1}`}</TableCell>
                  <TableCell>${parseFloat(scenario.totalProposedLoanAmount).toFixed(2)}</TableCell>
                  <TableCell>{parseFloat(scenario.newInterestRate).toFixed(2)}%</TableCell>
                  <TableCell>{scenario.loanTerm} years</TableCell>
                  <TableCell>${monthlyPayment}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}

// Helper function to calculate monthly payment
function calculateMonthlyPayment(loanAmount, interestRate, loanTermYears) {
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const monthlyPayment =
    (loanAmount * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
  return monthlyPayment;
}

export default ScenarioList;
