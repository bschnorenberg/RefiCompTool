// utils.js

// Function to format a number as US dollars (e.g., $1,234,567)
export const formatAsCurrency = (value) => {
    if (isNaN(value)) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0, // no decimal places
    }).format(value);
  };
  
  // Function to format a number as a percentage with two decimal places (e.g., 12.34%)
  export const formatAsPercentage = (value) => {
    if (isNaN(value)) return '';
    return `${parseFloat(value).toFixed(2)}%`;
  };
  