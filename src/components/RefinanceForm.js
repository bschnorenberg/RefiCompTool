// src/components/RefinanceForm.js
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Typography,
  Container,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
} from '@mui/material';
import { Add, Clear } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Import NumericFormat and necessary components
import { NumericFormat } from 'react-number-format';

// Custom styled components for headers
const MainHeader = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 'bold',
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontSize: '19px',
  fontWeight: 'bold',
}));

const SubHeader = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 'bold',
}));

// Custom NumericFormat component for currency formatting
function NumberFormatCustom(props) {
  const { inputRef, onChange, name, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      thousandSeparator
      prefix="$"
      decimalScale={2}
      fixedDecimalScale
      allowNegative={false}
      onValueChange={(values) => {
        onChange({
          target: {
            name,
            value: values.value,
          },
        });
      }}
    />
  );
}

// Custom NumericFormat component for percentage formatting
function PercentFormatCustom(props) {
  const { inputRef, onChange, name, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      suffix="%"
      decimalScale={2}
      fixedDecimalScale
      allowNegative={false}
      onValueChange={(values) => {
        onChange({
          target: {
            name,
            value: values.value,
          },
        });
      }}
    />
  );
}

function RefinanceForm({ addScenario, clearScenarios }) {
  // State variables for Borrower Information
  const [borrowerName, setBorrowerName] = useState('Borrower');
  const [propertyID, setPropertyID] = useState('Primary');

  // State variables for Property Information
  const [propertyAddress, setPropertyAddress] = useState('');
  const [currentValue, setCurrentValue] = useState('500000');
  const [currentTaxes, setCurrentTaxes] = useState('5000');
  const [currentInsurance, setCurrentInsurance] = useState('1200');

  // State variables for Existing Mortgage Information
  const [purchaseDate, setPurchaseDate] = useState('2022-01-01');
  const [purchasePrice, setPurchasePrice] = useState('500000');
  const [downPaymentPercent, setDownPaymentPercent] = useState('5.00');
  const [downPaymentAmount, setDownPaymentAmount] = useState('25000.00');
  const [originalLoanAmount, setOriginalLoanAmount] = useState('400000');
  const [interestRate, setInterestRate] = useState('7.50');
  const [isFHALoanExisting, setIsFHALoanExisting] = useState(false);
  const [pmiFactorExisting, setPMIFactorExisting] = useState('0.00');
  const [estimatedRemainingBalance, setEstimatedRemainingBalance] = useState('0');

  // State variables for Proposed Refinance Information
  const [baseLoanAmount, setBaseLoanAmount] = useState('0');
  const [cashOutAmount, setCashOutAmount] = useState('0');
  const [newInterestRate, setNewInterestRate] = useState('6.00');
  const [loanTerm, setLoanTerm] = useState('30'); // Default to 30 years
  const [loanType, setLoanType] = useState('Fixed'); // 'Fixed' or 'ARM'
  const [isFHALoanProposed, setIsFHALoanProposed] = useState(false);
  const [pmiFactorProposed, setPMIFactorProposed] = useState('0.00');
  const [ufmipAmount, setUFMIPAmount] = useState('0');

  // Costs and Fees
  const [areCostsFinanced, setAreCostsFinanced] = useState(true); // Default to financed
  // Loan Costs
  const [processingFee, setProcessingFee] = useState('1575.00');
  const [appraisalFee, setAppraisalFee] = useState('900.00');
  const [miscFees, setMiscFees] = useState('350.00');
  const [discountPointsPercent, setDiscountPointsPercent] = useState('0');
  const [discountPointsAmount, setDiscountPointsAmount] = useState('0');
  const [loanCosts, setLoanCosts] = useState('0');
  // Prepaids
  const [prepaidInterest, setPrepaidInterest] = useState('0');
  const [homeownersInsurancePrepaid, setHomeownersInsurancePrepaid] = useState('0');
  const [propertyTaxesPrepaid, setPropertyTaxesPrepaid] = useState('0');
  const [prepaids, setPrepaids] = useState('0');
  // Escrow Costs
  const [settlementFee, setSettlementFee] = useState('875.00');
  const [titleInsurance, setTitleInsurance] = useState('875.00');
  const [recordingFee, setRecordingFee] = useState('400.00');
  const [escrowCosts, setEscrowCosts] = useState('0');
  // Total Closing Costs
  const [totalClosingCosts, setTotalClosingCosts] = useState('0');

  // Loan Summary
  const [totalProposedLoanAmount, setTotalProposedLoanAmount] = useState('0');
  const [ltv, setLTV] = useState('0');

  // Additional Assumptions State Variables
  // Suppressed temporarily
  /*
  const [marginalTaxRate, setMarginalTaxRate] = useState('25.00'); // Default to 25%
  const [investmentReturnRate, setInvestmentReturnRate] = useState('5.00'); // Default to 5%
  const [inflationRate, setInflationRate] = useState('2.00'); // Default to 2%
  const [timeHorizon, setTimeHorizon] = useState('10'); // Default to 10 years
  const [appreciationRate, setAppreciationRate] = useState('3.00'); // Default to 3%
  */

  // Recalculate dependent fields when relevant inputs change
  useEffect(() => {
    // Calculate Down Payment Amount based on Percent
    if (purchasePrice && downPaymentPercent) {
      const dpAmount = (parseFloat(purchasePrice) * parseFloat(downPaymentPercent)) / 100;
      if (!isNaN(dpAmount)) {
        setDownPaymentAmount(dpAmount.toFixed(2));
      }
    }

    // Calculate Original Loan Amount
    if (purchasePrice && downPaymentAmount) {
      let loanAmount = parseFloat(purchasePrice) - parseFloat(downPaymentAmount);

      // Add upfront MIP if existing loan is FHA
      if (isFHALoanExisting) {
        const upfrontMIPExisting = loanAmount * 0.0175; // 1.75%
        loanAmount += upfrontMIPExisting;
      }

      if (!isNaN(loanAmount)) {
        setOriginalLoanAmount(loanAmount.toFixed(2));
      }
    }

    // Calculate Estimated Remaining Balance
    if (originalLoanAmount && interestRate && purchaseDate) {
      const monthsElapsed = calculateMonthsElapsed(purchaseDate);
      const remainingBalance = calculateRemainingBalance(
        parseFloat(originalLoanAmount),
        parseFloat(interestRate),
        monthsElapsed
      );
      if (!isNaN(remainingBalance)) {
        setEstimatedRemainingBalance(remainingBalance.toFixed(2));
      }
    }

    // Set Base Loan Amount (Estimated Remaining Balance + Cash-Out Amount)
    if (estimatedRemainingBalance && cashOutAmount) {
      const baseLoan = parseFloat(estimatedRemainingBalance) + parseFloat(cashOutAmount);
      if (!isNaN(baseLoan)) {
        setBaseLoanAmount(baseLoan.toFixed(2));
      }
    }

    // Calculate Discount Points Amount
    if (baseLoanAmount && discountPointsPercent) {
      const dpAmountNew =
        (parseFloat(baseLoanAmount) * parseFloat(discountPointsPercent)) / 100;
      if (!isNaN(dpAmountNew)) {
        setDiscountPointsAmount(dpAmountNew.toFixed(2));
      }
    }

    // Calculate Loan Costs
    const totalLoanCosts =
      parseFloat(processingFee || 0) +
      parseFloat(appraisalFee || 0) +
      parseFloat(miscFees || 0) +
      parseFloat(discountPointsAmount || 0);

    if (!isNaN(totalLoanCosts)) {
      setLoanCosts(totalLoanCosts.toFixed(2));
    }

    // Calculate Per-Diem Interest and Prepaid Interest (15 days)
    if (baseLoanAmount && newInterestRate) {
      const perDiemInterest =
        (parseFloat(baseLoanAmount) * (parseFloat(newInterestRate) / 100)) / 365;
      const prepaidInterestAmount = perDiemInterest * 15;
      if (!isNaN(prepaidInterestAmount)) {
        setPrepaidInterest(prepaidInterestAmount.toFixed(2));
      }
    }

    // Calculate Homeowners Insurance Prepaid (2 months)
    if (currentInsurance) {
      const monthlyInsurance = parseFloat(currentInsurance) / 12;
      const insurancePrepaid = monthlyInsurance * 2;
      if (!isNaN(insurancePrepaid)) {
        setHomeownersInsurancePrepaid(insurancePrepaid.toFixed(2));
      }
    }

    // Calculate Property Taxes Prepaid (6 months)
    if (currentTaxes) {
      const monthlyTaxes = parseFloat(currentTaxes) / 12;
      const taxesPrepaid = monthlyTaxes * 6;
      if (!isNaN(taxesPrepaid)) {
        setPropertyTaxesPrepaid(taxesPrepaid.toFixed(2));
      }
    }

    // Calculate Total Prepaids
    const totalPrepaids =
      parseFloat(prepaidInterest || 0) +
      parseFloat(homeownersInsurancePrepaid || 0) +
      parseFloat(propertyTaxesPrepaid || 0);

    if (!isNaN(totalPrepaids)) {
      setPrepaids(totalPrepaids.toFixed(2));
    }

    // Calculate Total Escrow Costs
    const totalEscrows =
      parseFloat(settlementFee || 0) +
      parseFloat(titleInsurance || 0) +
      parseFloat(recordingFee || 0);

    if (!isNaN(totalEscrows)) {
      setEscrowCosts(totalEscrows.toFixed(2));
    }

    // Calculate Total Closing Costs (Loan Costs + Prepaids + Escrow Costs + UFMIP if applicable)
    let totalClosingCostsCalc =
      parseFloat(loanCosts || 0) +
      parseFloat(prepaids || 0) +
      parseFloat(escrowCosts || 0);

    // Add UFMIP to closing costs if FHA Loan
    let ufmip = 0;
    if (isFHALoanProposed) {
      ufmip = parseFloat(baseLoanAmount) * 0.0175; // 1.75%
      setUFMIPAmount(ufmip.toFixed(2));
      totalClosingCostsCalc += ufmip;
    } else {
      setUFMIPAmount('0');
    }

    if (!isNaN(totalClosingCostsCalc)) {
      setTotalClosingCosts(totalClosingCostsCalc.toFixed(2));
    }

    // Calculate Total Proposed Loan Amount
    if (baseLoanAmount) {
      let totalLoan = parseFloat(baseLoanAmount);

      // Add UFMIP for FHA loans
      if (isFHALoanProposed) {
        totalLoan += ufmip;
      }

      // Add costs to loan amount if costs are financed
      if (areCostsFinanced) {
        totalLoan += totalClosingCostsCalc;
      }

      if (!isNaN(totalLoan)) {
        setTotalProposedLoanAmount(totalLoan.toFixed(2));
      }
    }

    // Calculate Loan-to-Value Ratio
    if (totalProposedLoanAmount && currentValue) {
      const ltvRatio =
        (parseFloat(totalProposedLoanAmount) / parseFloat(currentValue)) * 100;
      if (!isNaN(ltvRatio)) {
        setLTV(ltvRatio.toFixed(2));
      }
    }

    // Calculate PMI/MIP Factor for Existing Loan
    if (isFHALoanExisting) {
      // Determine whether to use new or old MIP rates based on purchase date
      const purchaseDateObj = new Date(purchaseDate);
      const mipChangeDate = new Date('2023-03-01');
      const useNewMIP = purchaseDateObj >= mipChangeDate;
      // Calculate Original LTV
      if (purchasePrice && originalLoanAmount) {
        const originalLTV = (parseFloat(originalLoanAmount) / parseFloat(purchasePrice)) * 100;
        const mipFactorExisting = calculateFHAMIPFactor(
          parseFloat(originalLoanAmount),
          parseFloat(originalLTV),
          30, // Assuming original loan term is 30 years
          useNewMIP
        );
        if (!isNaN(mipFactorExisting)) {
          setPMIFactorExisting(mipFactorExisting.toFixed(2));
        }
      }
    }

    // Calculate PMI/MIP Factor for Proposed Loan
    if (isFHALoanProposed) {
      // Use new MIP rates (assuming refinance is happening now)
      const mipFactor = calculateFHAMIPFactor(
        parseFloat(totalProposedLoanAmount),
        parseFloat(ltv),
        parseInt(loanTerm),
        true // Use new MIP rates
      );
      if (!isNaN(mipFactor)) {
        setPMIFactorProposed(mipFactor.toFixed(2));
      }
    }
  }, [
    purchasePrice,
    downPaymentPercent,
    downPaymentAmount,
    interestRate,
    purchaseDate,
    originalLoanAmount,
    isFHALoanExisting,
    estimatedRemainingBalance,
    cashOutAmount,
    baseLoanAmount,
    newInterestRate,
    loanTerm,
    loanType,
    isFHALoanProposed,
    pmiFactorProposed,
    ufmipAmount,
    areCostsFinanced,
    loanCosts,
    prepaids,
    escrowCosts,
    totalProposedLoanAmount,
    currentValue,
    ltv,
    currentInsurance,
    currentTaxes,
    processingFee,
    appraisalFee,
    miscFees,
    discountPointsPercent,
    discountPointsAmount,
    prepaidInterest,
    homeownersInsurancePrepaid,
    propertyTaxesPrepaid,
    settlementFee,
    titleInsurance,
    recordingFee,
    // Added dependencies
    pmiFactorExisting,
  ]);

  // Helper functions
  function calculateMonthsElapsed(startDate) {
    const start = new Date(startDate);
    const now = new Date();
    const months =
      (now.getFullYear() - start.getFullYear()) * 12 +
      now.getMonth() -
      start.getMonth();
    return months;
  }

  function calculateRemainingBalance(principal, rate, monthsElapsed) {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = 360; // 30-year loan
    const monthlyPayment =
      (principal * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
    const balance =
      principal * Math.pow(1 + monthlyRate, monthsElapsed) -
      monthlyPayment * ((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate);
    return balance;
  }

  // Helper function to calculate FHA MIP factor
  function calculateFHAMIPFactor(loanAmount, ltvRatio, loanTerm, useNewMIP) {
    const loanAmountThreshold = 726200; // Update as necessary
    let mipFactor = 0;

    if (useNewMIP) {
      // New MIP rates effective March 1, 2023
      if (loanTerm > 15) {
        // Loans > 15 years
        if (loanAmount <= loanAmountThreshold) {
          if (ltvRatio <= 90) {
            mipFactor = 0.50; // 50 bps
          } else if (ltvRatio <= 95) {
            mipFactor = 0.50; // 50 bps
          } else {
            mipFactor = 0.55; // 55 bps
          }
        } else {
          if (ltvRatio <= 90) {
            mipFactor = 0.70; // 70 bps
          } else if (ltvRatio <= 95) {
            mipFactor = 0.70; // 70 bps
          } else {
            mipFactor = 0.75; // 75 bps
          }
        }
      } else {
        // Loans ≤ 15 years
        if (loanAmount <= loanAmountThreshold) {
          if (ltvRatio <= 90) {
            mipFactor = 0.15; // 15 bps
          } else {
            mipFactor = 0.40; // 40 bps
          }
        } else {
          if (ltvRatio <= 78) {
            mipFactor = 0.15; // 15 bps
          } else if (ltvRatio <= 90) {
            mipFactor = 0.40; // 40 bps
          } else {
            mipFactor = 0.65; // 65 bps
          }
        }
      }
    } else {
      // Old MIP rates before March 1, 2023
      if (loanTerm > 15) {
        // Loans > 15 years
        if (loanAmount <= loanAmountThreshold) {
          if (ltvRatio <= 95) {
            mipFactor = 0.80; // 80 bps
          } else {
            mipFactor = 0.85; // 85 bps
          }
        } else {
          if (ltvRatio <= 95) {
            mipFactor = 1.00; // 100 bps
          } else {
            mipFactor = 1.05; // 105 bps
          }
        }
      } else {
        // Loans ≤ 15 years
        if (loanAmount <= loanAmountThreshold) {
          if (ltvRatio <= 90) {
            mipFactor = 0.45; // 45 bps
          } else {
            mipFactor = 0.70; // 70 bps
          }
        } else {
          if (ltvRatio <= 78) {
            mipFactor = 0.45; // 45 bps
          } else if (ltvRatio <= 90) {
            mipFactor = 0.70; // 70 bps
          } else {
            mipFactor = 0.95; // 95 bps
          }
        }
      }
    }

    return mipFactor;
  }

  // Handle Add Scenario button click
  const handleAddScenario = () => {
    // Prepare data to pass to ComparisonResults
    const calculatedResults = {
      scenarioName: `Scenario ${new Date().getTime()}`, // Unique name
      borrowerName,
      propertyID,
      propertyAddress,
      currentValue,
      currentTaxes,
      currentInsurance,
      purchaseDate,
      purchasePrice,
      downPaymentPercent,
      downPaymentAmount,
      originalLoanAmount,
      interestRate,
      isFHALoanExisting,
      pmiFactorExisting,
      estimatedRemainingBalance,
      baseLoanAmount,
      cashOutAmount,
      newInterestRate,
      loanTerm,
      loanType,
      isFHALoanProposed,
      pmiFactorProposed,
      ufmipAmount,
      areCostsFinanced,
      loanCosts,
      processingFee,
      appraisalFee,
      miscFees,
      discountPointsPercent,
      discountPointsAmount,
      prepaids,
      prepaidInterest,
      homeownersInsurancePrepaid,
      propertyTaxesPrepaid,
      escrowCosts,
      settlementFee,
      titleInsurance,
      recordingFee,
      totalClosingCosts,
      totalProposedLoanAmount,
      ltv,
      // Additional assumptions
      // marginalTaxRate,
      // investmentReturnRate,
      // inflationRate,
      // timeHorizon,
      // appreciationRate,
    };

    // Add the scenario to the list
    addScenario(calculatedResults);
  };

  return (
    <Container maxWidth="md">
      {/* Main Heading */}
      <MainHeader gutterBottom>
        Mortgage Refinance Comparison Tool
      </MainHeader>

      {/* Instruction */}
      <Typography variant="body1" gutterBottom>
        Fill in the details below and click "Add Scenario" to generate comparison results.
      </Typography>

      {/* Borrower Information */}
      <Box bgcolor="#B3E5FC" p={2} mt={2} borderRadius={2}>
        <SectionHeader gutterBottom>
          Borrower Information
        </SectionHeader>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Borrower Name"
              fullWidth
              size="small"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Property ID"
              fullWidth
              size="small"
              value={propertyID}
              onChange={(e) => setPropertyID(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Property Information */}
      <Box bgcolor="#C8E6C9" p={2} mt={2} borderRadius={2}>
        <SectionHeader gutterBottom>
          Property Information
        </SectionHeader>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Property Address"
              fullWidth
              size="small"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Current Market Value"
              fullWidth
              size="small"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              InputProps={{
                inputComponent: NumberFormatCustom,
                inputProps: {
                  name: 'currentValue',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Current Property Taxes (Annual)"
              fullWidth
              size="small"
              value={currentTaxes}
              onChange={(e) => setCurrentTaxes(e.target.value)}
              InputProps={{
                inputComponent: NumberFormatCustom,
                inputProps: {
                  name: 'currentTaxes',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Current Homeowner's Insurance (Annual)"
              fullWidth
              size="small"
              value={currentInsurance}
              onChange={(e) => setCurrentInsurance(e.target.value)}
              InputProps={{
                inputComponent: NumberFormatCustom,
                inputProps: {
                  name: 'currentInsurance',
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Existing Mortgage Information */}
      <Box bgcolor="#FFF9C4" p={2} mt={2} borderRadius={2}>
        <SectionHeader gutterBottom>
          Existing Mortgage Information
        </SectionHeader>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Purchase"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Purchase Price"
              fullWidth
              size="small"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              InputProps={{
                inputComponent: NumberFormatCustom,
                inputProps: {
                  name: 'purchasePrice',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Down Payment %"
              fullWidth
              size="small"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(e.target.value)}
              InputProps={{
                inputComponent: PercentFormatCustom,
                inputProps: {
                  name: 'downPaymentPercent',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Down Payment $"
              fullWidth
              size="small"
              value={downPaymentAmount}
              onChange={(e) => setDownPaymentAmount(e.target.value)}
              InputProps={{
                inputComponent: NumberFormatCustom,
                inputProps: {
                  name: 'downPaymentAmount',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Original Loan Amount"
              fullWidth
              size="small"
              value={originalLoanAmount}
              InputProps={{
                readOnly: true,
                inputComponent: NumberFormatCustom,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Interest Rate"
              fullWidth
              size="small"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              InputProps={{
                inputComponent: PercentFormatCustom,
                inputProps: {
                  name: 'interestRate',
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={isFHALoanExisting}
                  onChange={(e) => setIsFHALoanExisting(e.target.checked)}
                  name="isFHALoanExisting"
                  color="primary"
                  inputProps={{ 'aria-label': 'FHA Loan Switch (Existing)' }}
                />
              }
              label="FHA Loan"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={isFHALoanExisting ? 'MIP Factor' : 'PMI Factor'}
              fullWidth
              size="small"
              value={pmiFactorExisting}
              onChange={(e) => setPMIFactorExisting(e.target.value)}
              InputProps={{
                readOnly: isFHALoanExisting,
                inputComponent: PercentFormatCustom,
                inputProps: {
                  name: 'pmiFactorExisting',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Estimated Remaining Balance"
              fullWidth
              size="small"
              value={estimatedRemainingBalance}
              InputProps={{
                readOnly: true,
                inputComponent: NumberFormatCustom,
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Proposed Refinance Information */}
      <Box bgcolor="#FFE0B2" p={2} mt={2} borderRadius={2}>
        <SectionHeader gutterBottom>
          Proposed Refinance Information
        </SectionHeader>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Base Loan Amount"
              fullWidth
              size="small"
              value={baseLoanAmount}
              InputProps={{
                readOnly: true,
                inputComponent: NumberFormatCustom,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Cash-Out Amount"
              fullWidth
              size="small"
              value={cashOutAmount}
              onChange={(e) => setCashOutAmount(e.target.value)}
              InputProps={{
                inputComponent: NumberFormatCustom,
                inputProps: {
                  name: 'cashOutAmount',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="New Interest Rate"
              fullWidth
              size="small"
              value={newInterestRate}
              onChange={(e) => setNewInterestRate(e.target.value)}
              InputProps={{
                inputComponent: PercentFormatCustom,
                inputProps: {
                  name: 'newInterestRate',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Loan Term (Years)</InputLabel>
              <Select
                value={loanTerm}
                label="Loan Term (Years)"
                onChange={(e) => setLoanTerm(e.target.value)}
              >
                <MenuItem value="15">15</MenuItem>
                <MenuItem value="20">20</MenuItem>
                <MenuItem value="25">25</MenuItem>
                <MenuItem value="30">30</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Loan Type</InputLabel>
              <Select
                value={loanType}
                label="Loan Type"
                onChange={(e) => setLoanType(e.target.value)}
              >
                <MenuItem value="Fixed">Fixed Rate</MenuItem>
                <MenuItem value="ARM">Adjustable Rate Mortgage</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={isFHALoanProposed}
                  onChange={(e) => setIsFHALoanProposed(e.target.checked)}
                  name="isFHALoanProposed"
                  color="primary"
                  inputProps={{ 'aria-label': 'FHA Loan Switch (Proposed)' }}
                />
              }
              label="FHA Loan"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={isFHALoanProposed ? 'MIP Factor' : 'PMI Factor'}
              fullWidth
              size="small"
              value={pmiFactorProposed}
              onChange={(e) => setPMIFactorProposed(e.target.value)}
              InputProps={{
                readOnly: isFHALoanProposed,
                inputComponent: PercentFormatCustom,
                inputProps: {
                  name: 'pmiFactorProposed',
                },
              }}
            />
          </Grid>
          {isFHALoanProposed && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Upfront MIP Amount"
                fullWidth
                size="small"
                value={ufmipAmount}
                InputProps={{
                  readOnly: true,
                  inputComponent: NumberFormatCustom,
                }}
              />
            </Grid>
          )}
        </Grid>

        {/* Loan Costs */}
        <Box bgcolor="#FFF9C4" p={2} mt={2} borderRadius={2}>
          <SubHeader gutterBottom>
            Loan Costs - Total: $
            {loanCosts !== '0' ? parseFloat(loanCosts).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </SubHeader>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Processing & Underwriting Fee"
                fullWidth
                size="small"
                value={processingFee}
                onChange={(e) => setProcessingFee(e.target.value)}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                  inputProps: {
                    name: 'processingFee',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Appraisal Fee"
                fullWidth
                size="small"
                value={appraisalFee}
                onChange={(e) => setAppraisalFee(e.target.value)}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                  inputProps: {
                    name: 'appraisalFee',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Miscellaneous Fees"
                fullWidth
                size="small"
                value={miscFees}
                onChange={(e) => setMiscFees(e.target.value)}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                  inputProps: {
                    name: 'miscFees',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Discount Points %"
                fullWidth
                size="small"
                value={discountPointsPercent}
                onChange={(e) => setDiscountPointsPercent(e.target.value)}
                InputProps={{
                  inputComponent: PercentFormatCustom,
                  inputProps: {
                    name: 'discountPointsPercent',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Discount Points $"
                fullWidth
                size="small"
                value={discountPointsAmount}
                InputProps={{
                  readOnly: true,
                  inputComponent: NumberFormatCustom,
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Prepaids */}
        <Box bgcolor="#FFF9C4" p={2} mt={2} borderRadius={2}>
          <SubHeader gutterBottom>
            Prepaids - Total: $
            {prepaids !== '0' ? parseFloat(prepaids).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </SubHeader>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Prepaid Interest (15 days)"
                fullWidth
                size="small"
                value={prepaidInterest}
                InputProps={{
                  readOnly: true,
                  inputComponent: NumberFormatCustom,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Homeowner's Insurance Prepaid"
                fullWidth
                size="small"
                value={homeownersInsurancePrepaid}
                InputProps={{
                  readOnly: true,
                  inputComponent: NumberFormatCustom,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Property Taxes Prepaid"
                fullWidth
                size="small"
                value={propertyTaxesPrepaid}
                InputProps={{
                  readOnly: true,
                  inputComponent: NumberFormatCustom,
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Escrow Costs */}
        <Box bgcolor="#FFF9C4" p={2} mt={2} borderRadius={2}>
          <SubHeader gutterBottom>
            Escrow Costs - Total: $
            {escrowCosts !== '0' ? parseFloat(escrowCosts).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </SubHeader>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Settlement Fee"
                fullWidth
                size="small"
                value={settlementFee}
                onChange={(e) => setSettlementFee(e.target.value)}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                  inputProps: {
                    name: 'settlementFee',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Title Insurance"
                fullWidth
                size="small"
                value={titleInsurance}
                onChange={(e) => setTitleInsurance(e.target.value)}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                  inputProps: {
                    name: 'titleInsurance',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Recording Fee"
                fullWidth
                size="small"
                value={recordingFee}
                onChange={(e) => setRecordingFee(e.target.value)}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                  inputProps: {
                    name: 'recordingFee',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Total Closing Costs and Finance Costs into Loan Amount */}
        <Box bgcolor="#FFF9C4" p={2} mt={2} borderRadius={2}>
          <SubHeader gutterBottom>
            Total Closing Costs - $
            {totalClosingCosts !== '0' ? parseFloat(totalClosingCosts).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </SubHeader>
          <FormControlLabel
            control={
              <Switch
                checked={areCostsFinanced}
                onChange={(e) => setAreCostsFinanced(e.target.checked)}
                name="areCostsFinanced"
                color="primary"
                inputProps={{ 'aria-label': 'Finance Costs into Loan Amount Switch' }}
              />
            }
            label="Finance Costs into Loan Amount"
          />
        </Box>
      </Box>

      {/* Additional Assumptions */}
      {/* Temporarily suppressed */}
      {/* 
      <Box bgcolor="#F5F5F5" p={2} mt={2} borderRadius={2}>
        <SectionHeader gutterBottom>
          Additional Assumptions
        </SectionHeader>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Marginal Tax Rate (%)"
              fullWidth
              size="small"
              value={marginalTaxRate}
              onChange={(e) => setMarginalTaxRate(e.target.value)}
              InputProps={{
                inputComponent: PercentFormatCustom,
                inputProps: {
                  name: 'marginalTaxRate',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Expected Investment Return Rate (%)"
              fullWidth
              size="small"
              value={investmentReturnRate}
              onChange={(e) => setInvestmentReturnRate(e.target.value)}
              InputProps={{
                inputComponent: PercentFormatCustom,
                inputProps: {
                  name: 'investmentReturnRate',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Expected Inflation Rate (%)"
              fullWidth
              size="small"
              value={inflationRate}
              onChange={(e) => setInflationRate(e.target.value)}
              InputProps={{
                inputComponent: PercentFormatCustom,
                inputProps: {
                  name: 'inflationRate',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Time Horizon (Years)"
              fullWidth
              size="small"
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Property Appreciation Rate (%)"
              fullWidth
              size="small"
              value={appreciationRate}
              onChange={(e) => setAppreciationRate(e.target.value)}
              InputProps={{
                inputComponent: PercentFormatCustom,
                inputProps: {
                  name: 'appreciationRate',
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
      */}

      {/* Loan Summary */}
      <Box bgcolor="#E1BEE7" p={2} mt={2} borderRadius={2}>
        <SectionHeader gutterBottom>
          Loan Summary
        </SectionHeader>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Total Proposed Loan Amount"
              fullWidth
              size="small"
              value={totalProposedLoanAmount}
              InputProps={{
                readOnly: true,
                inputComponent: NumberFormatCustom,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Loan-to-Value (LTV) Ratio (%)"
              fullWidth
              size="small"
              value={ltv}
              InputProps={{
                readOnly: true,
                inputComponent: PercentFormatCustom,
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Buttons at the Bottom */}
      <Grid container spacing={2} justifyContent="flex-start" mt={2} mb={4}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAddScenario}
          >
            Add Scenario
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<Clear />}
            onClick={clearScenarios}
          >
            Clear Scenarios
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default RefinanceForm;
