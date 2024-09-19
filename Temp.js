        {/* Interest Rate */}
        <TableRow>
        <TableCell>Interest Rate</TableCell>
        <TableCell>{existingMortgage.interestRate}%</TableCell>
        {scenarioResults.map((result, index) => (
          <TableCell key={index}>{result.newInterestRate}%</TableCell>
        ))}
      </TableRow>