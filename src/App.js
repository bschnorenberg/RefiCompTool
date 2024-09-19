// src/App.js
import React, { useState } from 'react';
import RefinanceForm from './components/RefinanceForm';
import ComparisonResults from './components/ComparisonResults';
import { Container, Typography } from '@mui/material';

function App() {
  // State to hold an array of scenarios
  const [scenarios, setScenarios] = useState([]);
  // State to hold existing mortgage data
  const [existingMortgageData, setExistingMortgageData] = useState(null);

  // Handler to add a new scenario
  const addScenario = (scenario) => {
    setScenarios((prevScenarios) => [...prevScenarios, scenario]);
    setExistingMortgageData(scenario.existingMortgageData || {});
  };

  // Handler to clear all scenarios and existing data
  const clearScenarios = () => {
    setScenarios([]);
    setExistingMortgageData(null);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <RefinanceForm addScenario={addScenario} clearScenarios={clearScenarios} />
      {scenarios.length > 0 && existingMortgageData && (
        <>
          <ComparisonResults existingMortgageData={existingMortgageData} scenarios={scenarios} />
        </>
      )}
    </Container>
  );
}

export default App;
