// src/components/ComparisonResults.js
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Box
} from '@mui/material';

function ComparisonResults({ scenarios }) {
  if (scenarios.length === 0) {
    return (
      <Typography variant="body1" style={{ marginTop: '20px' }}>
        No scenarios to compare.
      </Typography>
    );
  }

  // Extract existing mortgage data from the first scenario
  const existingMortgageData = scenarios[0];

  // Existing Mortgage Calculations
  const yearsElapsed = calculateYearsElapsed(existingMortgageData.purchaseDate);
  const remainingTerm = 30 - yearsElapsed;

  const existingMonthlyPayment = calculateMonthlyPayment(
    parseFloat(existingMortgageData.estimatedRemainingBalance),
    parseFloat(existingMortgageData.interestRate),
    remainingTerm
  );

  const existingPMIPayment = (parseFloat(existingMortgageData.pmiFactorExisting) > 0)
    ? calculatePMIPayment(
        parseFloat(existingMortgageData.estimatedRemainingBalance),
        parseFloat(existingMortgageData.pmiFactorExisting)
      )
    : 0;

  const existingMonthlyTaxesInsurance = (
    parseFloat(existingMortgageData.currentTaxes || 0) / 12 +
    parseFloat(existingMortgageData.currentInsurance || 0) / 12
  );

  const existingTotalMonthlyPayment = existingMonthlyPayment +
    existingPMIPayment +
    existingMonthlyTaxesInsurance;

  const existingTotalInterestPaid = calculateTotalInterestPaid(
    existingMonthlyPayment,
    remainingTerm,
    parseFloat(existingMortgageData.estimatedRemainingBalance)
  );

  const existingLoanPayoffDate = new Date().getFullYear() + remainingTerm;

  // Scenario Calculations
  const scenarioResults = scenarios.map((scenario) => {
    // Parse inputs
    const marginalTaxRate = parseFloat(scenario.marginalTaxRate) || 0;
    const investmentReturnRate = parseFloat(scenario.investmentReturnRate) || 0.0001; // Avoid division by zero
    const inflationRate = parseFloat(scenario.inflationRate) || 0.0001; // Avoid division by zero
    const timeHorizon = parseInt(scenario.timeHorizon) || 0;
    const appreciationRate = parseFloat(scenario.appreciationRate) || 0;

    // Monthly Payment (P&I)
    const monthlyPayment = calculateMonthlyPayment(
      parseFloat(scenario.totalProposedLoanAmount),
      parseFloat(scenario.newInterestRate),
      parseInt(scenario.loanTerm)
    );

    // PMI/MIP Payment
    const pmiPayment = (parseFloat(scenario.pmiFactorProposed) > 0)
      ? calculatePMIPayment(
          parseFloat(scenario.totalProposedLoanAmount),
          parseFloat(scenario.pmiFactorProposed)
        )
      : 0;

    // Monthly Taxes and Insurance
    const monthlyTaxesInsurance = (
      parseFloat(scenario.currentTaxes || 0) / 12 +
      parseFloat(scenario.currentInsurance || 0) / 12
    );

    // Total Monthly Payment (PITI)
    const totalMonthlyPayment = monthlyPayment + pmiPayment + monthlyTaxesInsurance;

    // Monthly Savings
    const monthlySavings = existingTotalMonthlyPayment - totalMonthlyPayment;

    // Break-even Point
    const totalClosingCosts = parseFloat(scenario.totalClosingCosts) || 0;
    const breakEvenPointMonths = calculateBreakEvenPoint(totalClosingCosts, monthlySavings);

    // Total Interest Paid Over Loan Term
    const totalInterestPaid = calculateTotalInterestPaid(
      monthlyPayment,
      parseInt(scenario.loanTerm),
      parseFloat(scenario.totalProposedLoanAmount)
    );

    // Effective Interest Rate After Taxes
    const effectiveInterestRate = calculateEffectiveInterestRate(
      parseFloat(scenario.newInterestRate),
      marginalTaxRate
    );

    // Net Present Value (NPV) of Savings
    const npvOfSavings = calculateNPV(
      monthlySavings,
      investmentReturnRate,
      timeHorizon
    );

    // Inflation-Adjusted Savings
    const inflationAdjustedSavings = calculateInflationAdjustedSavings(
      monthlySavings,
      inflationRate,
      timeHorizon
    );

    // Payback Period Including Time Value of Money
    const paybackPeriod = calculateDiscountedPaybackPeriod(
      totalClosingCosts,
      monthlySavings,
      investmentReturnRate
    );

    // Equity Build-Up Over Time
    const equity = calculateEquityBuildUp(
      parseFloat(scenario.totalProposedLoanAmount),
      parseFloat(scenario.newInterestRate),
      parseInt(scenario.loanTerm),
      timeHorizon,
      parseFloat(scenario.currentValue),
      appreciationRate
    );

    // Opportunity Cost of Cash-Out Amount
    const cashOutAmount = parseFloat(scenario.cashOutAmount) || 0;
    const opportunityCost = cashOutAmount > 0
      ? calculateOpportunityCost(
          cashOutAmount,
          investmentReturnRate,
          timeHorizon
        )
      : 0;

    // Loan Payoff Date
    const loanPayoffDate = new Date().getFullYear() + parseInt(scenario.loanTerm);

    return {
      ...scenario,
      monthlyPayment: monthlyPayment.toFixed(2),
      pmiPayment: pmiPayment.toFixed(2),
      monthlyTaxesInsurance: monthlyTaxesInsurance.toFixed(2),
      totalMonthlyPayment: totalMonthlyPayment.toFixed(2),
      monthlySavings: monthlySavings.toFixed(2),
      breakEvenPointMonths: isFinite(breakEvenPointMonths) ? breakEvenPointMonths.toFixed(1) : 'N/A',
      totalInterestPaid: totalInterestPaid.toFixed(2),
      effectiveInterestRate: effectiveInterestRate.toFixed(2),
      npvOfSavings: npvOfSavings.toFixed(2),
      inflationAdjustedSavings: inflationAdjustedSavings.toFixed(2),
      paybackPeriod: isFinite(paybackPeriod) ? paybackPeriod.toFixed(1) : 'N/A',
      equity: equity.toFixed(2),
      opportunityCost: opportunityCost.toFixed(2),
      loanPayoffDate,
    };
  });

  // Display Results
  return (
    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom style={{ padding: '16px' }}>
        Comparison Results
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Criteria</strong></TableCell>
            <TableCell><strong>Existing Mortgage</strong></TableCell>
            {scenarioResults.map((result, index) => (
              <TableCell key={index}><strong>{result.scenarioName || `Scenario ${index + 1}`}</strong></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Traditional Comparison Metrics Section */}
          <TableRow style={{ backgroundColor: '#e0f7fa' }}>
            <TableCell colSpan={2 + scenarioResults.length}>
              <Typography variant="h6">Traditional Comparison Metrics</Typography>
            </TableCell>
          </TableRow>

          {/* Interest Rate */}
          <TableRow>
            <TableCell>Interest Rate</TableCell>
            <TableCell>{existingMortgageData.interestRate}%</TableCell> {/* Use existingMortgageData instead of existingMortgage */}
            {scenarioResults.map((result, index) => (
              <TableCell key={index}>{result.newInterestRate}%</TableCell>
            ))}
          </TableRow>
          
          {/* Monthly Principal and Interest */}
          <TableRow>
            <TableCell>Monthly Principal and Interest</TableCell>
            <TableCell>${existingMonthlyPayment.toFixed(2)}</TableCell>
            {scenarioResults.map((result, index) => (
              <TableCell key={index}>${result.monthlyPayment}</TableCell>
            ))}
          </TableRow>
          
          {/* Monthly Mortgage Insurance */}
          <TableRow>
            <TableCell>Monthly Mortgage Insurance (PMI/MIP)</TableCell>
            <TableCell>${existingPMIPayment.toFixed(2)}</TableCell>
            {scenarioResults.map((result, index) => (
              <TableCell key={index}>${result.pmiPayment}</TableCell>
            ))}
          </TableRow>
          {/* Monthly Taxes and Insurance */}
          <TableRow>
            <TableCell>Monthly Taxes and Insurance</TableCell>
            <TableCell>${existingMonthlyTaxesInsurance.toFixed(2)}</TableCell>
            {scenarioResults.map((result, index) => (
              <TableCell key={index}>${result.monthlyTaxesInsurance}</TableCell>
            ))}
          </TableRow>
          {/* Total Monthly PITI Payment */}
          <TableRow>
            <TableCell><strong>Total Monthly PITI Payment</strong></TableCell>
            <TableCell><strong>${existingTotalMonthlyPayment.toFixed(2)}</strong></TableCell>
            {scenarioResults.map((result, index) => (
              <TableCell key={index}><strong>${result.totalMonthlyPayment}</strong></TableCell>
            ))}
          </TableRow>
          {/* Monthly Savings */}
          <TableRow>
            <TableCell>Monthly Savings</TableCell>
            <TableCell>N/A</TableCell>
            {scenarioResults.map((result, index) => (
              <TableCell key={index}>${result.monthlySavings}</TableCell>
            ))}
          </TableRow>
          {/* Break-Even Point */}
          <TableRow>
            <TableCell>Break-Even Point (Months)</TableCell>
            <TableCell>N/A</TableCell>
            {scenarioResults.map((result, index) => (
              <TableCell key={index}>{result.breakEvenPointMonths}</TableCell>
            ))}
          </TableRow>

          {/* Secondary Comparison Considerations Section */}
          <TableRow style={{ backgroundColor: '#f1f8e9' }}>
            <TableCell colSpan={2 + scenarioResults.length}>
              <Typography variant="h6">Secondary Comparison Considerations</Typography>
            </TableCell>
          </TableRow>
          {/* Total Interest Paid Over Loan Term */}
          <TableRow>
            <TableCell>Total Interest Paid Over Loan Term</TableCell>
            <TableCell>${existingTotalInterestPaid.toFixed(2)}</TableCell>
            {scenarioResults.map((result, index) => (
              <TableCell key={index}>${result.totalInterestPaid}</TableCell>
            ))}
          </TableRow>
          {/* Total Cost of Home at End of Loan Term */}
          {/* For simplicity, let's assume it's Loan Amount + Total Interest Paid */}
          <TableRow>
            <TableCell>Total Cost of Home at End of Loan Term</TableCell>
            <TableCell>
              $
              {(
                parseFloat(existingMortgageData.estimatedRemainingBalance) +
                existingTotalInterestPaid
              ).toFixed(2)}
            </TableCell>
            {scenarioResults.map((result, index) => (
              <TableCell key={index}>
                $
                {(
                  parseFloat(result.totalProposedLoanAmount) +
                  parseFloat(result.totalInterestPaid)
                ).toFixed(2)}
              </TableCell>
            ))}
          </TableRow>
          {/* Effective Interest Rate After Taxes (%) */}
          <TableRow>
            <TableCell>Effective Interest Rate After Taxes (%)</TableCell>
            <TableCell>N/A</TableCell>
            {scenarioResults.map((result, index) => (
              <TableCell key={index}>{result.effectiveInterestRate}%</TableCell>
            ))}
          </TableRow>
          {/* Net Present Value of Savings */}
          <TableRow>
            <TableCell>Net Present Value of Savings</TableCell>
            <TableCell>N/A</TableCell>
            {scenarioResults.map((result, index) => (
              <TableCell key={index}>${result.npvOfSavings}</TableCell>
            ))}
          </TableRow>
          {/* Inflation-Adjusted Savings */}
          <TableRow>
            <TableCell>Inflation-Adjusted Savings</TableCell>
            <TableCell>N/A</TableCell>
            {scenarioResults.map((result, index) => (
              <TableCell key={index}>${result.inflationAdjustedSavings}</TableCell>
            ))}
          </TableRow>
          {/* Payback Period */}
          <TableRow>
            <TableCell>Payback Period (Months, Discounted)</TableCell>
            <TableCell>N/A</TableCell>
            {scenarioResults.map((result, index) => (
              <TableCell key={index}>{result.paybackPeriod}</TableCell>
            ))}
          </TableRow>
          {/* Equity After Time Horizon */}
          <TableRow>
            <TableCell>Equity After {scenarioResults[0].timeHorizon} Years</TableCell>
            <TableCell>N/A</TableCell>
            {scenarioResults.map((result, index) => (
              <TableCell key={index}>${result.equity}</TableCell>
            ))}
          </TableRow>
          {/* Opportunity Cost of Cash-Out Amount */}
          <TableRow>
            <TableCell>Opportunity Cost of Cash-Out Amount</TableCell>
            <TableCell>N/A</TableCell>
            {scenarioResults.map((result, index) => (
              <TableCell key={index}>${result.opportunityCost}</TableCell>
            ))}
          </TableRow>
          {/* Loan Payoff Date */}
          <TableRow>
            <TableCell>Loan Payoff Date</TableCell>
            <TableCell>{existingLoanPayoffDate}</TableCell>
            {scenarioResults.map((result, index) => (
              <TableCell key={index}>{result.loanPayoffDate}</TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Helper Functions
function calculateYearsElapsed(purchaseDate) {
  const start = new Date(purchaseDate);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  const m = now.getMonth() - start.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < start.getDate())) {
    years--;
  }
  return years;
}

function calculateMonthlyPayment(loanAmount, interestRate, loanTermYears) {
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const monthlyPayment =
    (loanAmount * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
  return monthlyPayment;
}

function calculatePMIPayment(loanAmount, pmiFactor) {
  return (loanAmount * (pmiFactor / 100)) / 12;
}

function calculateTotalInterestPaid(monthlyPayment, loanTermYears, loanAmount) {
  const totalPayments = monthlyPayment * loanTermYears * 12;
  const totalInterest = totalPayments - loanAmount;
  return totalInterest;
}

function calculateBreakEvenPoint(totalClosingCosts, monthlySavings) {
  if (monthlySavings === 0) return Infinity;
  return totalClosingCosts / monthlySavings;
}

function calculateEffectiveInterestRate(interestRate, marginalTaxRate) {
  const effectiveRate = interestRate * (1 - marginalTaxRate / 100);
  return effectiveRate;
}

function calculateNPV(monthlySavings, discountRate, timeHorizonYears) {
  let npv = 0;
  const discountFactor = 1 + discountRate / 100 / 12;
  for (let t = 1; t <= timeHorizonYears * 12; t++) {
    npv += monthlySavings / Math.pow(discountFactor, t);
  }
  return npv;
}

function calculateInflationAdjustedSavings(monthlySavings, inflationRate, timeHorizonYears) {
  let adjustedSavings = 0;
  const inflationFactor = 1 + inflationRate / 100 / 12;
  for (let t = 1; t <= timeHorizonYears * 12; t++) {
    adjustedSavings += monthlySavings / Math.pow(inflationFactor, t);
  }
  return adjustedSavings;
}

function calculateDiscountedPaybackPeriod(totalClosingCosts, monthlySavings, discountRate) {
  let cumulativeDiscountedSavings = 0;
  const monthlyDiscountRate = discountRate / 100 / 12;
  let month = 0;
  while (cumulativeDiscountedSavings < totalClosingCosts && month < 360) {
    month++;
    const discountedSavings = monthlySavings / Math.pow(1 + monthlyDiscountRate, month);
    cumulativeDiscountedSavings += discountedSavings;
  }
  return month;
}

function calculateEquityBuildUp(loanAmount, interestRate, loanTermYears, yearsElapsed, currentValue, appreciationRate) {
  const remainingBalance = calculateRemainingBalanceAfterYears(loanAmount, interestRate, loanTermYears, yearsElapsed);
  const projectedPropertyValue = currentValue * Math.pow(1 + appreciationRate / 100, yearsElapsed);
  const equity = projectedPropertyValue - remainingBalance;
  return equity;
}

function calculateRemainingBalanceAfterYears(loanAmount, interestRate, loanTermYears, yearsElapsed) {
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
  const paymentsMade = yearsElapsed * 12;
  const balance =
    loanAmount * Math.pow(1 + monthlyRate, paymentsMade) -
    monthlyPayment * ((Math.pow(1 + monthlyRate, paymentsMade) - 1) / monthlyRate);
  return balance;
}

function calculateOpportunityCost(cashOutAmount, investmentReturnRate, timeHorizonYears) {
  const futureValue = cashOutAmount * Math.pow(1 + investmentReturnRate / 100, timeHorizonYears);
  return futureValue - cashOutAmount;
}

export default ComparisonResults;
