import React, { useState } from 'react';

function calculateMonthlyPayment(principal, annualInterestRate, numberOfPayments) {
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  return (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
}


function RefinanceForm() {
  // State hooks for form data
  const [borrowerName, setBorrowerName] = useState('');
  const [propertyID, setPropertyID] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [propertyTaxes, setPropertyTaxes] = useState('');
  const [homeownersInsurance, setHomeownersInsurance] = useState('');

  const [purchasePrice, setPurchasePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [existingLoanMonthlyPayment, setExistingLoanMonthlyPayment] = useState('0.00');

  const [newLoanAmount, setNewLoanAmount] = useState('');
  const [newInterestRate, setNewInterestRate] = useState('');
  const [proposedMonthlyPayment, setProposedMonthlyPayment] = useState('0.00');

  
  return (
    <form className="refinance-form">
      <h3>Subject Property</h3>
      <div className="form-group">
        <label>Borrower Name:</label>
        <input 
          type="text" 
          value={borrowerName} 
          onChange={(e) => setBorrowerName(e.target.value)} 
        />
      </div>
      <div className="form-group">
        <label>Property ID:</label>
        <input 
          type="text" 
          value={propertyID} 
          onChange={(e) => setPropertyID(e.target.value)} 
        />
      </div>
      <div className="form-group">
        <label>Current Value:</label>
        <input 
          type="number" 
          value={currentValue} 
          onChange={(e) => setCurrentValue(e.target.value)} 
        />
      </div>
      <div className="form-group">
        <label>Property Taxes (Annual):</label>
        <input 
          type="number" 
          value={propertyTaxes} 
          onChange={(e) => setPropertyTaxes(e.target.value)} 
        />
      </div>
      <div className="form-group">
        <label>Homeowner's Insurance Premium (Annual):</label>
        <input 
          type="number" 
          value={homeownersInsurance} 
          onChange={(e) => setHomeownersInsurance(e.target.value)} 
        />
      </div>

      <h3>Existing Mortgage</h3>
      <div className="form-group">
        <label>Purchase Price:</label>
        <input 
          type="number" 
          value={purchasePrice} 
          onChange={(e) => setPurchasePrice(e.target.value)} 
        />
      </div>
      <div className="form-group">
        <label>Down Payment:</label>
        <input 
          type="number" 
          value={downPayment} 
          onChange={(e) => setDownPayment(e.target.value)} 
        />
      </div>
      <div className="form-group">
        <label>Interest Rate:</label>
        <input 
          type="number" 
          step="0.01" 
          value={interestRate} 
          onChange={(e) => setInterestRate(e.target.value)} 
        />
      </div>

      <h3>Proposed Refinance</h3>
      <div className="form-group">
        <label>New Loan Amount:</label>
        <input 
          type="number" 
          value={newLoanAmount} 
          onChange={(e) => setNewLoanAmount(e.target.value)} 
        />
      </div>
      <div className="form-group">
        <label>New Interest Rate:</label>
        <input 
          type="number" 
          step="0.01" 
          value={newInterestRate} 
          onChange={(e) => setNewInterestRate(e.target.value)} 
        />
      </div>
    </form>
  );
}

export default RefinanceForm;
