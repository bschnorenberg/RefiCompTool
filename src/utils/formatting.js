// src/utils/formatting.js

/**
 * Formats a number into a currency string with comma separators and two decimal places.
 * @param {number|string} amount - The amount to format.
 * @returns {string} - The formatted currency string (e.g., "1,544,344.00").
 */
export function formatCurrency(amount) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return '0.00';
    return parsedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  /**
   * Formats a number into a percentage string with a specified number of decimal places.
   * @param {number|string} rate - The rate to format.
   * @param {number} decimals - Number of decimal places (default is 2).
   * @returns {string} - The formatted percentage string (e.g., "5.123%").
   */
  export function formatPercentage(rate, decimals = 2) {
    const parsedRate = parseFloat(rate);
    if (isNaN(parsedRate)) return '0.000%';
    return parsedRate.toFixed(decimals) + '%';
  }
  